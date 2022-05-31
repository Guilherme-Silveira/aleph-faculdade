import googlemaps
from haversine import haversine
from flask import jsonify
from conexao import connection
from conexao import es_connection


cursor = connection.cursor()

def create_user_db(usuario):
  sql = f"INSERT INTO projeto.usuario(nome,cpf,usuario,senha) VALUES ('{usuario.nome}','{usuario.cpf}','{usuario.usuario}','{usuario.senha}')"
  cursor.execute(sql)
  connection.commit()
  return jsonify({ 
    'message': 'Usuario cadastrado!'
  })

def get_login_db(usuario, senha):
  sql = f"SELECT id, usuario, senha FROM projeto.usuario WHERE usuario='{usuario}' AND senha='{senha}'"
  cursor.execute(sql)
  result = cursor.fetchall()
  if len(result) > 0:
    return ({
      'id': result[0][0],
      'usuario': result[0][1],
      'senha': result[0][2]
    })
  else:
    return ({
      'message': 'Usuario ou senha incorreto(s)'
    })

def create_review_db(avaliacao):
  sql = f"INSERT INTO projeto.avaliacao(deficiencia, estrutura, acessibilidade, comentario, id_ubs, id_usuario) VALUES ('{avaliacao.deficiencia}', {avaliacao.estrutura}, {avaliacao.acessibilidade}, '{avaliacao.comentario}', '{avaliacao.id_ubs}', {avaliacao.id_usuario})"
  cursor.execute(sql)
  connection.commit()
  return jsonify({
    'message': 'Avaliacao cadastrada'
  })

def get_ubs_by_name_db(cep, nome):
  gmaps = googlemaps.Client(key='AIzaSyAoffgA6HLynJ83waSAhh3leCzxmEYiPl8')
  geocode_result = gmaps.geocode(cep)[0]['geometry']['location']
  result = es_connection.search(index='ubs', query={
    "match": {
      "NOME": {
        "query": nome,
        "operator": "and"
      }
    }
  }, sort=[
    {
      "_geo_distance" : {
        "LOCALIZACAO": [geocode_result['lng'], geocode_result['lat']],
        "order" : "asc",
        "unit" : "km",
        "mode" : "min",
        "distance_type" : "arc",
        "ignore_unmapped": "true"
      }
    }
  ], size=20)['hits']['hits']
  return jsonify(result)

def get_ubs_by_id_db(id):
  result = es_connection.search(index='ubs', query={
    "match": {
      "CNES": id
    }
  })['hits']['hits'][0]['_source']
  return result

def get_ubs_by_cep_db(cep):
  gmaps = googlemaps.Client(key='AIzaSyAoffgA6HLynJ83waSAhh3leCzxmEYiPl8')
  geocode_result = gmaps.geocode(cep)[0]['geometry']['location']
  result = es_connection.search(index='ubs', query={
    "bool": {
      "filter": {
        "geo_distance": {
          "distance": "20km",
          "LOCALIZACAO": {
            "lat": geocode_result['lat'],
            "lon": geocode_result['lng']
          }
        }
      }
    }
  }, sort=[
    {
      "_geo_distance" : {
        "LOCALIZACAO": [geocode_result['lng'], geocode_result['lat']],
        "order" : "asc",
        "unit" : "km",
        "mode" : "min",
        "distance_type" : "arc",
        "ignore_unmapped": "true"
      }
    }
  ], size=20)
  return jsonify(dict(result)['hits']['hits'])

def get_ubs_by_review_db(deficiencia, uf):
  sql = """
  SELECT 
    u.nome, 
    AVG(a.acessibilidade) as media 
  FROM avaliacao as a 
  INNER JOIN ubs as u 
  ON a.id_ubs = u.cnes 
  WHERE 
    u.uf = 35 
    AND 
    a.deficiencia = 'fala' 
  GROUP BY nome 
  ORDER BY media DESC
  """