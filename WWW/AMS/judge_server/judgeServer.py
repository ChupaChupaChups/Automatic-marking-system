#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import threading
import subprocess
import docker
import shutil
import io
import os
from collections import deque
from .config import Config
__author__ = "isac322, nameuk"

_docker_client = None
_docker_queue = deque()

def _get_client():
    """
	Return global variable ``_docker_client``
	if ``_docker_client`` doesn't exist make it and return

	Rather than make client handle every time needed, using this method are reduce duplicate client object

	:return docker-py's docker client handle
	"""
    global _docker_client

    if _docker_client is None:
        #: docker daemon address
        docker_daemon = Config["Docker"]["daemon_address"]
        #: python interface of docker's client handler
        _docker_client = docker.Client(base_url=docker_daemon, version="auto")
    return _docker_client


def build_image():
    docker_client = _get_client()

    docker_tag = Config["Docker"]["tag"]

    # if docker image that named `docker_tag` is not exist than, generate it
    #	for DEBUG
    #	if len(docker_client.images(name=docker_tag)) is 0:
    current_path = os.path.dirname(__file__)
    with open(os.path.join(current_path, Config["Docker"]["Dockerfile"])) as dockerfile_fp:
        dockerfile_text = io.BytesIO(dockerfile_fp.read().encode("UTF-8"))

        for line in docker_client.build(fileobj=dockerfile_text, tag=docker_tag, rm=True):
            j = json.loads(line.decode())
            for _, v in j.items():
                print(v, end='')


# else:
#		print("'{0}' image is already exist".format(docker_tag))


def start_judge(media_path, inputfiles, outputfiles):
    client = _get_client()
    image_tag = Config["Docker"]["tag"]

    build_image()

    current = os.path.join(os.path.dirname(__file__), 'judge_scripts')
    json_path = os.path.dirname(media_path)
    resultfiles = os.path.dirname(media_path)
    resultfiles = os.path.join(resultfiles, 'resultfiles')

    container = client.create_container(
        image=image_tag,
        command='/compiler_and_judge/compile_execute.sh',
        volumes=['/source_code', '/compiler_and_judge', '/inputfiles', '/resultfiles', '/jsonpath', '/outputfiles'],
        host_config=client.create_host_config(binds={
            json_path: {'bind': '/json_file', 'mode': 'rw'},
            media_path: {'bind': '/source_code', 'mode': 'rw'},
            current: {'bind': '/compiler_and_judge', 'mode': 'rw'},
            inputfiles: {'bind': '/inputfiles', 'mode': 'ro'},
            resultfiles: {'bind': '/resultfiles', 'mode': 'rw'},
            outputfiles: {'bind': '/outputfiles', 'mode': 'ro'},
        })
    )
    global _docker_queue
    _docker_queue.append(container)
    while True:
        #print(len(_docker_queue))
        if len(_docker_queue) <= 5:
            client.start(container)
            try:
                #print("try")
                client.wait(container=container, timeout=5)
                client.remove_container(container)
            except:
                result_path = os.path.join(json_path, "result.json")
                with open(result_path, "w") as file:
                    json.dump(
                    {
                        'time': 0,
                        'answer': 0,
                        'answer_percent': 0,
                        'timeout': True,
                    },
                    file, ensure_ascii=False)

                _docker_queue.popleft()
                #print(client.logs(container))
                subprocess.call(['chmod', '777', json_path])
                log_path = os.path.join(json_path, 'log.txt')
                log = open(log_path, "wb")
                log.write(client.logs(container))
                log.close()

            break

# TODO: when debug is finished, must handle docker container exception at this point

def make_container(image_tag, command=None, volume_bind=None, **kwargs):
    client = _get_client()

    if volume_bind is not None:
        config = client.create_host_config(binds=volume_bind)

        container = client.create_container(
            image=image_tag,
            command=command,
            volumes=list(volume_bind.keys()),
            host_config=config,
            **kwargs
        )

        return container, config

    else:
        container = client.create_container(
            image=image_tag,
            command=command,
            **kwargs
        )
        return container


def get_websocket(container):
    client = _get_client()

    return client.attach_socket(container=container, params={
        'stdin': 1,
        'stdout': 1,
        'stderr': 1,
        'stream': 1
    }, ws=True)


def async_start_container(container):
    client = _get_client()

    def _target():
        client.start(container)
        client.wait(container)
        client.remove_container(container)

    thread = threading.Thread(target=_target, daemon=True)
    thread.start()


def kill_container(container):
    client = _get_client()
    client.kill(container)


if __name__ == "__main__":
    build_image()


class ContainerStatusError(Exception):
    pass
