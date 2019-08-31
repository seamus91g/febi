from febiweb import app
import argparse


def main():
    parser = argparse.ArgumentParser(description='Input params')
    parser.add_argument('-d', '--debug', action='store_true', help='Run in debug mode')
    args = parser.parse_args()

    app.run(host='0.0.0.0', port=80, debug=args.debug)

if __name__ == '__main__':
    main()
