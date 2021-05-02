from flask import Flask

app = Flask(__name__)

@app.route('/')
def route_call():
    return 'server started'

if __name__ == '__main__':
    app.run(debug=True)