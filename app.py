from flask import Flask, request
from middleware import *
from model.Usuario import Usuario
from model.Avaliacao import Avaliacao

app = Flask(__name__)

@app.route('/create_user', methods=['POST'])
def create_user():
  content = request.json
  nome = content['nome']
  cpf = content['cpf']
  usuario = content['usuario']
  senha = content['senha']

  obj_usuario = Usuario(nome, cpf, usuario, senha)
  response = create_user_db(obj_usuario)
  return response

@app.route('/login', methods=['GET'])
def get_login():
  usuario = request.args.get('usuario')
  senha = request.args.get('senha')

  result = get_login_db(usuario, senha)
  return result

@app.route('/create_review', methods=['POST'])
def create_review():
  content = request.json
  deficiencia = content['deficiencia']
  estrutura = content['estrutura']
  acessibilidade = content['acessibilidade']
  comentario = content['comentario']
  id_ubs = content['id_ubs']
  id_usuario = content['id_usuario']
  obj_review = Avaliacao(deficiencia, estrutura, acessibilidade, comentario, id_ubs, id_usuario)
  response = create_review_db(obj_review)
  return response

@app.route('/get_ubs_by_name', methods=['GET'])
def get_ubs_by_name():
  nome = request.args.get('nome')
  cep = request.args.get('cep')
  response = get_ubs_by_name_db(cep, nome)
  return response

@app.route('/get_ubs_by_id', methods=['GET'])
def get_ubs_by_id():
  id = request.args.get('id')
  response = get_ubs_by_id_db(id)
  return response

@app.route('/get_ubs_by_cep')
def get_ubs_by_cep():
  cep = request.args.get('cep')
  response = get_ubs_by_cep_db(cep)
  return response

app.run(host='0.0.0.0', port=5001)

