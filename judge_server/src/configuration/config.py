#!/usr/bin/python3
# -*- coding: utf-8 -*-

import json
from os import path

CONST_configFile = path.join(path.dirname(__file__), "config.json")


class MetaConfig(type):
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
	pass
