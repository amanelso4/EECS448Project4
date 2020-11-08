import http.server
import socketserver
Handler = http.server.SimpleHTTPRequestHandler
Handler.extensions_map.update({
       ".js": "application/javascript",
});
httpd = socketserver.TCPServer(("", 8000), Handler)
httpd.serve_forever()