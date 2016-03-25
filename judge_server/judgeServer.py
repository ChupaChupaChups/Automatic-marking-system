import os
import io
import docker

client = docker.Client(version="1.18")

for s in client.images(all=True):
	print(s)

Dockerfile = open(os.path.join(os.path.dirname(__file__), "Dockerfile"))

DockerfileText = io.BytesIO(Dockerfile.read().encode("UTF-8"))
for line in client.build(fileobj=DockerfileText, tag='judge_docker'):
	print(line)
