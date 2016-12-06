# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)

import json


def get_user_email():
    return auth.user.email if auth.user else None

db.define_table('villages',
                Field('user_email', default=auth.user.email if auth.user_id else None),
                Field('village', 'text'))

def nicefy(b):
    if b is None:
        return 'None'
    obj = json.loads(b)
    s = json.dumps(obj, indent=2)
    return s