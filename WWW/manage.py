#!/usr/bin/env python3
import sys

import os
from AMS import onlineshellmanager

if __name__ == "__main__":
	os.environ.setdefault("DJANGO_SETTINGS_MODULE", "WWW.settings")

	from django.core.management import execute_from_command_line

	execute_from_command_line(sys.argv)

	onlineshellmanager.close_all_shell()
