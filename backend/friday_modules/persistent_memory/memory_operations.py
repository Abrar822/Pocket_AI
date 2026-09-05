def fetch_locations(conn):
    cursor = None
    try:
        cursor = conn.cursor()
        query = """SELECT f_name, location FROM memory"""
        cursor.execute(query)
        rows = cursor.fetchall()
        file_data = [{"f_name": row[0], "location": row[1]} for row in rows]
        return file_data
    finally:
        if cursor:
            cursor.close()
