function CriarTabelas(){
    var query = 'CREATE TABLE IF NOT EXISTS Clientes(id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, nome VARCHAR NOT NULL, endereco VARCHAR NOT NULL, numero INTEGER, estcivil VARCHAR, idade VARCHAR NOT NULL, obs VARCHAR);';
    try {
        localDB.transaction(function(transaction){
            transaction.executeSql(query, [], nullDataHandler, errorHandler);
            AtualizaStatus("Tabela 'CLIENTES' status: OK.");
        });
    } 
    catch (e) {
        AtualizaStatus("Erro: Tabela 'CLIENTES' n�o criada " + e + ".");
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
        AtualizaStatus("'Nome', 'Endere�o e 'Idade' s�o campos obrigat�rios!");
    }
    else {
        var query = "insert into Clientes (nome, endereco, numero, estcivil, idade, obs) VALUES (?, ?, ?, ?, ?, ?);";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [nome, endereco, numero, estcivil, idade, obs], function(transaction, results){
					//sen�o inseriu
                    if (!results.rowsAffected) {
                        AtualizaStatus("Erro: Inser��o n�o realizada");
                    }
                    else {
                        AtualizaForm("","","","","","");
                        AtualizaStatus("Inser��o realizada, linha id: " + results.insertId);
                        AtualizaLista();
                    }
                }, errorHandler);
            });
        }
        catch (e) {
            AtualizaStatus("Erro: INSER��O n�o realizado " + e + ".");
        }
    }


}

//atualiza��o
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
        AtualizaStatus("'Nome', 'Endere�o e 'Idade' s�o campos obrigat�rios!");
    }
    else {
        var query = "update Clientes set nome=?, endereco=?, numero=?, estcivil=?, idade=?, obs=? where id=?;";
        try {
            localDB.transaction(function(transaction){
                transaction.executeSql(query, [nome, endereco, numero, estcivil, idade, obs, id], function(transaction, results){
					//sen�o atualizou
                    if (!results.rowsAffected) {
                        AtualizaStatus("Erro: Atualiza��o n�o realizado.");
                    }
                    else {
                        AtualizaForm("","","","","","","");
                        AtualizaStatus("Atualiza��o realizado:" + results.rowsAffected);
                        AtualizaLista();
                    }
                }, errorHandler);
            });
        } 
        catch (e) {
            AtualizaStatus("Erro: ATUALIZA��O n�o realizado " + e + ".");
        }
    }
}

function onDelete(){
    var id = document.getElementById('id').value;
    
    var query = "delete from Clientes where id=?;";
    try {
        localDB.transaction(function(transaction){
        
            transaction.executeSql(query, [id], function(transaction, results){
				//sen�o deletou
                if (!results.rowsAffected) {
                    AtualizaStatus("Erro: Exclus�o n�o realizada.");
                }
                else {
                    AtualizaForm("", "", "");
                    AtualizaStatus("Linhas exclu�das:" + results.rowsAffected);
                    AtualizaLista();
                }
            }, errorHandler);
        });
    } 
    catch (e) {
        AtualizaStatus("Erro: EXCLUS�O n�o realizada " + e + ".");
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
        AtualizaStatus("Error: CONSULTA n�o realizada " + e + ".");
    }
   
}