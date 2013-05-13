function CriarTabelas(){
    var query = 'CREATE TABLE IF NOT EXISTS Clientes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome VARCHAR NOT NULL, endereco VARCHAR NOT NULL, numero INTEGER, estcivil VARCHAR, idade VARCHAR NOT NULL, obs VARCHAR);';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            AtualizaStatus("Tabela 'CLIENTES' status: OK.");
        });
    } 
    catch (e) {
        AtualizaStatus("Erro: Tabela 'CLIENTES' não criada " + e + ".");
        return;
    }
}

//insere dados do form
function onCreate(){
    var nome     = document.getElementById('nome').value;
	var endereco = document.getElementById('endereco').value;
	var numero 	 = document.getElementById('numero').value;
	var estcivil = document.getElementById('estcivil').value;
	var idade 	 = document.getElementById('idade').value;
    var obs 	 = document.getElementById('obs').value;

	//verifica se os campos obrigatorios nao estao vazios
    if (nome == "" || idade == "" || endereco== "") {
        AtualizaStatus("'Nome', 'Endereço e 'Idade' são campos obrigatórios!");
    }
    else {
        var query = "insert into Clientes (nome, endereco, numero, estcivil, idade, obs) VALUES (?, ?, ?, ?, ?, ?);";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [nome, endereco, numero, estcivil, idade, obs], function(transaction, results){
					//senão inseriu
                    if (!results.rowsAffected) {
                        AtualizaStatus("Erro: Inserção não realizada");
                    }
                    else {
                        AtualizaForm("","","","","","");
                        AtualizaStatus("Inserção realizada, linha id: " + results.insertId);
                        AtualizaLista();
                    }
                }, errorHandler);
            });
        }
        catch (e) {
            AtualizaStatus("Erro: INSERÇÃO não realizado " + e + ".");
        }
    }


}

//atualização
function onUpdate(){
	//atribui os dados do form as variaveis
    var id 		 = document.getElementById('id').value;
    var nome     = document.getElementById('nome').value;
	var endereco = document.getElementById('endereco').value;
	var numero 	 = document.getElementById('numero').value;
	var estcivil = document.getElementById('estcivil').value;
	var idade 	 = document.getElementById('idade').value;
    var obs 	 = document.getElementById('obs').value;
	
	//verifica se os campos obrigatorios nao estao vazios
    if (nome == "" || idade == "" || endereco== "") {
        AtualizaStatus("'Nome', 'Endereço e 'Idade' são campos obrigatórios!");
    }
    else {
        var query = "update Clientes set nome=?, endereco=?, numero=?, estcivil=?, idade=?, obs=? where id=?;";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [nome, endereco, numero, estcivil, idade, obs, id], function(transaction, results){
					//senão atualizou
                    if (!results.rowsAffected) {
                        AtualizaStatus("Erro: Atualização não realizado.");
                    }
                    else {
                        AtualizaForm("","","","","","","");
                        AtualizaStatus("Atualização realizado:" + results.rowsAffected);
                        AtualizaLista();
                    }
                }, errorHandler);
            });
        } 
        catch (e) {
            AtualizaStatus("Erro: ATUALIZAÇÃO não realizado " + e + ".");
        }
    }
}

function onDelete(){
    var id = document.getElementById('id').value;
    
    var query = "delete from Clientes where id=?;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [id], function(transaction, results){
				//senão deletou
                if (!results.rowsAffected) {
                    AtualizaStatus("Erro: Exclusão não realizada.");
                }
                else {
                    AtualizaForm("", "", "");
                    AtualizaStatus("Linhas excluídas:" + results.rowsAffected);
                    AtualizaLista();
                }
            }, errorHandler);
        });
    } 
    catch (e) {
        AtualizaStatus("Erro: EXCLUSÃO não realizada " + e + ".");
    }
}


function onSelect(htmlLIElement){
	var id = htmlLIElement.getAttribute("id");
	
	query = "SELECT * FROM Clientes where id=?;";
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [id], function(transaction, results){
                var row = results.rows.item(0);
                AtualizaForm(row['id'], row['nome'], row['endereco'], row['numero'], row['estcivil'], row['idade'], row['obs']);
            }, function(transaction, error){
                AtualizaStatus("Erro: " + error.code + "<br>Mensagem: " + error.message);
            });
        });
    } 
    catch (e) {
        AtualizaStatus("Error: CONSULTA não realizada " + e + ".");
    }
   
}