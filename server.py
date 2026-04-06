import http.server, os

port = int(os.environ.get('PORT', 3000))
os.chdir('/Users/choiyunjeong/Downloads/landing')

with http.server.HTTPServer(('', port), http.server.SimpleHTTPRequestHandler) as httpd:
    httpd.serve_forever()
