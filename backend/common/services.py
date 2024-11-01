import random
import string
from datetime import datetime


def generate_access_code():
    codes = []

    for length in [3, 4, 3]:
        codes.append(''.join(random.choice(string.ascii_lowercase) for i in range(length)))

    return '-'.join(codes)


def generate_unique_id():
    return datetime.now().strftime("%Y%m%d%H%M%S%f")