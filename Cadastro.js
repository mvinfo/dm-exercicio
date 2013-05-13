var localDB = null;

//quando inicializa a pagina
function onInit(){
    try {
        if (!window.openDatabase) {
            AtualizaStatus("Erro: Seu navegador não está habilitado para trabalhar com banco de dados.");
        }
        else {
            initDB();
            CriarTabelas();
            AtualizaLista();
        }
    } 
    catch (e) {
        if (e == 2) {
            AtualizaStatus("Erro: Versão de banco de dados inválida.");
        }
        else {
            AtualizaStatus("Erro: Erro desconhecido: " + e + ".");
        }
        return;
    }
}

//inicializa banco de dados
function initDB(){
    var shortName = 'stuffDB';
    var version = '1.0';
    var displayName = 'MyStuffDB';
    var maxSize = 65536; // Em bytes
    localDB = window.openDatabase(shortName, version, displayName, maxSize);
}

function AtualizaLista(){

	//pega o nº de linhas existentes na lista
    var dataRows = document.getElementById("itemData").getElementsByClassName("data");
	
	//deleta linha a linha na lista
    while (dataRows.length > 0) {
        row = dataRows[0];
        document.getElementById("itemData").removeChild(row);
    };
    
	//Realiza a leitura no banco e cria novas linhas na tabela.
    var query = "SELECT * FROM Clientes;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [], function(transaction, results){
                for (var i = 0; i < results.rows.length; i++) {
                
                    var row = results.rows.item(i);
                    var li = document.createElement("li");
					li.setAttribute("id", row['id']);
                    li.setAttribute("class", "data");
                    li.setAttribute("style", "background-color:gray;color:yellow");
                    li.setAttribute("onclick", "onSelect(this)");
                    
                    var liText = document.createTextNode(row['id']+' | '+ row['nome']);
                    li.appendChild(liText);
                    
                    document.getElementById("itemData").appendChild(li);
                }
            }, function(transaction, error){
                AtualizaStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
    } 
    catch (e) {
        AtualizaStatus("Error: SELECT não realizado " + e + ".");
    }
}

//manipulador de erro
errorHandler = function(transaction, error){
    AtualizaStatus("Erro: " + error.message);
    return true;
}

nullDataHandler = function(transaction, results){
}

//preenche o formulario com os dados selecionado
function AtualizaForm(id, nome, endereco, numero, estcivil, idade, obs){
  document.getElementById('id').value = id;
  document.getElementById('nome').value = nome;
  document.getElementById('endereco').value = endereco;
  document.getElementById('numero').value = numero;
  document.getElementById('estcivil').value = estcivil;
  document.getElementById('idade').value = idade;
  document.getElementById('obs').value = obs;
}

function AtualizaStatus(status){
    document.getElementById('status').innerHTML = status;
}