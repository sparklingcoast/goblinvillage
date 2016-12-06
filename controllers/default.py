# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

import traceback
import requests
import random


def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return u.first_name

@auth.requires_login()
def get_village():
    row = db(db.villages.user_email == auth.user.email).select().first()
    if row==None:
        return response.json(dict(village="None"))
    return response.json(dict(village=row.village))

def get_other_villages():
    rows = db(db.villages).select()
    unlucky_village = rows[random.randint(0, len(rows)-1)]
    return response.json(dict(unlucky_village=unlucky_village.village, user_name=get_user_name_from_email(unlucky_village.user_email)))

@auth.requires_login()
def update_village():
    row = db(db.villages.user_email == auth.user.email).select().first()
    if row == None:
        db.villages.insert(user_email=auth.user.email,village=request.vars.village)
    else:
        row.update_record(village = request.vars.village)
    #db.villages.insert(
    #    village=request.vars.village
    #)

@auth.requires_login()
def index():
    return dict()


def user():
    return dict(form=auth())


@cache.action()
def download():
    return response.download(request, db)


def call():
    return service()


