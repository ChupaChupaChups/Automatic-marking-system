from channels.routing import route
from . import websocket_handler

channel_routing = [
	# Called when WebSockets connect
	route("websocket.connect", websocket_handler.open_test, path=r'^/ws'),

	# Called when WebSockets get sent a data frame
	route("websocket.receive", websocket_handler.req_handler, path=r'^/ws'),

	# Called when WebSockets disconnect
	# route("websocket.disconnect", onlineshellmanager.build_session),
]
