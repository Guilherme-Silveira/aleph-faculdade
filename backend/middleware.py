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
  gmaps = googlemaps.Client(key='123456789')
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
  for i in result:
    km = calc_km((geocode_result['lat'], geocode_result['lng']), (float(i['_source']['LOCALIZACAO']['lat']), float(i['_source']['LOCALIZACAO']['lon'])))
    i['_source']['km'] = km
  return jsonify(result)

def get_ubs_by_id_db(id):
  sql = f"""
    SELECT a.deficiencia, a.estrutura, a.acessibilidade, a.comentario, a.id_ubs, u.usuario, a.id_avaliacao
    FROM projeto.avaliacao as a
    INNER JOIN projeto.usuario as u
    ON u.id = a.id_usuario
    WHERE a.id_ubs = '{id}'
  """
  cursor.execute(sql)
  response = cursor.fetchall()
  result = []
  for i in response:
    result.append({
      'deficiencia': i[0],
      'estrutura': i[1],
      'acessibilidade': i[2],
      'comentario': i[3],
      'id_ubs': i[4],
      'usuario': i[5],
      'id_avaliacao': i[6]
    })
  return jsonify(result)

def get_ubs_by_cep_db(cep):
  gmaps = googlemaps.Client(key='123456789')
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
  ], size=20)['hits']['hits']
  for i in result:
    km = calc_km((geocode_result['lat'], geocode_result['lng']), (float(i['_source']['LOCALIZACAO']['lat']), float(i['_source']['LOCALIZACAO']['lon'])))
    i['_source']['km'] = km
  return jsonify(result)

def get_ubs_by_review_db(cep, deficiencia, uf):
  gmaps = googlemaps.Client(key='123456789')
  geocode_result = gmaps.geocode(cep)[0]['geometry']['location']

  sql = f"""
  SELECT 
    u.cnes,
    u.nome,
    u.longitude,
    u.latitude,
    AVG(a.acessibilidade) as media 
  FROM projeto.avaliacao as a 
  INNER JOIN projeto.ubs as u 
  ON a.id_ubs = u.cnes 
  WHERE 
    u.uf = {uf} 
    AND 
    a.deficiencia = '{deficiencia}' 
  GROUP BY u.nome, u.cnes, u.longitude, u.latitude
  ORDER BY media DESC
  """
  cursor.execute(sql)
  result = cursor.fetchall()
  response = []
  for i in result:
    km = calc_km((geocode_result['lat'], geocode_result['lng']), (float(i[3].replace(',', '.')), float(i[2].replace(',', '.'))))
    response.append({
      'cnes': i[0],
      'nome': i[1],
      'km': km,
      'media': float(i[4])
    })  
  return jsonify(response)

def calc_km(source, dest):
  return "{:.3f}".format(haversine((source[0], source[1]), (dest[0], dest[1])))