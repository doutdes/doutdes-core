# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import argparse
import json
import csv
import sys
from io import open
import urllib.request
import os

from inscrawler import InsCrawler
from inscrawler.settings import override_settings
from inscrawler.settings import prepare_override_settings

def usage():
    return """
        python crawler.py posts -u cal_foodie -n 100 -o ./output
        python crawler.py posts_full -u cal_foodie -n 100 -o ./output
        python crawler.py profile -u cal_foodie -o ./output
        python crawler.py profile_script -u cal_foodie -o ./output
        python crawler.py hashtag -t taiwan -o ./output

        The default number for fetching posts via hashtag is 100.
    """


#def get_posts_by_user(username, number, detail, debug):
#    ins_crawler = InsCrawler(has_screen=debug)
#    return ins_crawler.get_user_posts(username, number, detail)

def get_posts_by_user(username, number, detail, debug):
    ins_crawler = InsCrawler(has_screen=debug)
    return ins_crawler.get_user_posts(username, number, detail)


def get_profile(username):
    ins_crawler = InsCrawler()
    return ins_crawler.get_user_profile(username)


def get_profile_from_script(username):
    ins_cralwer = InsCrawler()
    return ins_cralwer.get_user_profile_from_script_shared_data(username)


def get_posts_by_hashtag(tag, number, debug):
    ins_crawler = InsCrawler(has_screen=debug)
    return ins_crawler.get_latest_posts_by_tag(tag, number)


def arg_required(args, fields=[]):
    for field in fields:
        if not getattr(args, field):
            parser.print_help()
            sys.exit()

def image(username, data):
    # filename = path

    # with open(filename, encoding="utf8") as json_file:
    #     data = json.load(json_file)
    username = username.replace('.', '')
    print(username.split())
    username = username.split()[0]
    if not os.path.isdir('./' + username):
        os.mkdir('./' + username)

    for id, x in enumerate(data):

        path = "./" + username + "/" + str(id) + ".jpg"

        urllib.request.urlretrieve(x['img_urls'][0], path)

def output(data, json_filepath, csv_filepath, username):
    out = json.dumps(data, ensure_ascii=False)

    if json_filepath:
        with open(json_filepath, "a", encoding="utf8") as f:
            f.write(out)
    elif csv_filepath:
        with open(csv_filepath, 'a', newline='', encoding="utf-8") as file:
            keys = data[0].keys()
            w = csv.DictWriter(file, keys)
            w.writeheader()
            w.writerows(data)
    else:
        print(out.encode("utf8"))

    image(username, data)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Instagram Crawler", usage=usage())
    parser.add_argument(
        "mode", help="options: [posts, posts_full, profile, profile_script, hashtag]"
    )
    parser.add_argument("-n", "--number", type=int, help="number of returned posts")
    parser.add_argument("-u", "--username", help="instagram's username")
    parser.add_argument("-l", "--list", help="instagram's username")
    parser.add_argument("-t", "--tag", help="instagram's tag name")
    parser.add_argument("-o", "--output", help="output file name(json format)")
    parser.add_argument("-c", "--csv", help="output file name(csv format)")
    parser.add_argument("--debug", action="store_true")

    prepare_override_settings(parser)

    args = parser.parse_args()

    override_settings(args)

    if args.mode in ["posts", "posts_full"] and args.list == None:
        arg_required("username")
        output(
            get_posts_by_user(
                args.username, args.number, args.mode == "posts_full", args.debug
            ),
            args.output, args.csv, args.username
        )
    elif args.mode in ["posts", "posts_full"] and not args.list == None:
        f = open(args.list, "r", encoding="utf8")

        for name in f:

            output(
                get_posts_by_user(
                    name, args.number, args.mode == "posts_full", args.debug
                ),
                args.output, args.csv, name
            )
    elif args.mode == "profile":
        arg_required("username")
        output(get_profile(args.username), args.output, args.csv, args.username)
    elif args.mode == "profile_script":
        arg_required("username")
        output(get_profile_from_script(args.username), args.output, args.csv, args.username)
    elif args.mode == "hashtag":
        arg_required("tag")
        output(
            get_posts_by_hashtag(args.tag, args.number or 100, args.debug), args.output, args.csv, args.username
        )
    else:
        usage()
