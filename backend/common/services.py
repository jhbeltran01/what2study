import random
import string
from datetime import datetime
import uuid


def generate_access_code():
    codes = []

    for length in [3, 4, 3]:
        codes.append(''.join(random.choice(string.ascii_lowercase) for i in range(length)))

    return '-'.join(codes)


def generate_unique_id():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S%f")  # Timestamp down to microseconds
    unique_suffix = uuid.uuid4().hex[:8]  # Shortened UUID for uniqueness
    return f"{timestamp}-{unique_suffix}"