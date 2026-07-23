import os
from neo4j import GraphDatabase

uri = "neo4j+s://a08d2a00.databases.neo4j.io"
username = "neo4j"  # Aura default is neo4j
password = "4wlC9JFnYVmvqmIVegLYn7OlvncDatbmTfNXgq56Bk4"

try:
    print(f"Connecting to {uri} with user {username}...")
    driver = GraphDatabase.driver(uri, auth=(username, password))
    driver.verify_connectivity()
    print("Connection successful with user 'neo4j'!")
    driver.close()
except Exception as e:
    print(f"Failed with user 'neo4j': {e}")
    try:
        username = "a08d2a00"
        print(f"\nTrying with user {username}...")
        driver = GraphDatabase.driver(uri, auth=(username, password))
        driver.verify_connectivity()
        print(f"Connection successful with user '{username}'!")
        driver.close()
    except Exception as e2:
        print(f"Failed with user '{username}': {e2}")
