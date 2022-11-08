window.onload = function () {
	var formRegistro = document.datos;
	var Elementos = formRegistro.elements;
	formRegistro.onsubmit = validar;

	for(var i = 0; i<Elementos.length; i++){
		
		Elementos[i].onkeypress = restringir2
	}


function validar(){
	
	
	for (var i = 0; i<Elementos.length; i++){
		if(Elementos[i].value.length < 3){
			console.log("El campo: ",Elementos[i].name, "está muy corto");
			return false;
		}
	}
	
	for (var i = 0; i<Elementos.length; i++){

		if(Elementos[i].value.length > 25){
			console.log("El campo: ",Elementos[i].name, "está muy largo");
			return false;
		}
	}
	for (var i = 0; i<Elementos.length; i++){
			valor = Elementos[i].value;
			if(valor==null || valor.length==0 || /^\s+$/.test(valor)){
				console.log("Por favor ingrésele valores a: ",Elementos[i].name);
				return false;
			}
		}

	
	
}


function restringir2(evento){
	var caracteresPermitidos = "";

	switch(this.type){
		case "password":
			caracteresPermitidos= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~(),:;<>@[]."
		default: 
			caracteresPermitidos="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@."
	}


	var letra = String.fromCharCode(evento.charCode);

	return caracteresPermitidos.indexOf(letra) != -1;
}
}