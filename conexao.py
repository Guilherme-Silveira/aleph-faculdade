import mysql.connector
from elasticsearch import Elasticsearch


def create_server_connection(host_name, user_name, user_password):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password
        )
        print("MySQL Database connection successful")
    except Error as err:
        print(f"Error: '{err}'")

    return connection

def create_es_connection(CLOUD_ID, ELASTIC_PASSWORD):

    client = Elasticsearch(
        cloud_id=CLOUD_ID,
        basic_auth=("elastic", ELASTIC_PASSWORD)
    )
    print(client.info)
    return client

connection = create_server_connection('localhost', 'root', 'gui@123')
es_connection = create_es_connection('my-lab:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJDA4ZmQ3MWI3ODg4NDQxMTI4YWIzZTJiYmQxZDA5NWMyJGRmMDk2MmI1YTA2NzRkMzA4MjdiY2U0ZjI5YzVjYzdl', 'dHp7P00LRz44ebm1sHWFCarS')