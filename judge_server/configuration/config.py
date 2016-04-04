#!/usr/bin/python3
# -*- coding: utf-8 -*-

import json
from os import path

CONST_configFile = path.join(path.dirname(__file__), "config.json")


class MetaConfig(type):
	"""Read server configuration from ``config.json`` placed in same directory with this file.
	"""

	config = None

	@staticmethod
	def __getitem__(item):
		if MetaConfig.config is None:
			MetaConfig.config = MetaConfig.read_config()

		return MetaConfig.config[item]

	@staticmethod
	def __setitem__(key, value):
		if MetaConfig.config is None:
			MetaConfig.config = MetaConfig.read_config()

		MetaConfig.config[key] = value
		MetaConfig.write_config(MetaConfig.config)

	@staticmethod
	def read_config():
		fp = open(CONST_configFile, mode='r')
		config = json.load(fp)
		fp.close()

		return config

	@staticmethod
	def write_config(config):
		fp = open(CONST_configFile, mode='w')
		json.dump(config, fp)
		fp.close()


class Config(metaclass=MetaConfig):
	"""This is realization of metaclass `MetaConfig`_.
	It's used for static referencing of special method like ``__getitem__()``.

	So you can access to class statically without create any instance of `Config`_ whenever and wherever.


	Usage:
		>>> Config["Docker"]["version"]

	Role and explains of this class are in `MetaConfig`_.

	More info about metaclass and static access in python:
	http://stackoverflow.com/questions/6187932/how-to-write-a-static-python-getitem-method
	"""
	pass
