const f_registro=document.getElementById('registro');
const inputs = document.querySelectorAll('#registro input');
	
window.onload = function () {
	var formRegistro = document.datos;
	var Elementos = formRegistro.elements;
	formRegistro.onsubmit = validar;
	const Contra = (e) =>{
		switch(e.target.name){
			case "passw2":
				validarContra();
				break;
		}
	}

	inputs.forEach((input)=>{
		input.addEventListener('blur',Contra);
	});

	const validarContra= ()=>{
		const inputPassw1= document.getElementById('passw1');
		const inputPassw2= document.getElementById('passw2');
		var ocultar_mens=document.getElementById("formulario__input-error");
		console.log(ocultar_mens);
		if(inputPassw1.value!== inputPassw2.value){
			alert("Ambas contraseñas deben coincidir");
			ocultar_mens.className = "formulario__input-error-activo";
			
			return false;

		}
	
	}
}
	
	




	for(var i = 0; i<Elementos.length; i++){
		
		Elementos[i].onkeypress = restringir2;
	
		//Elementos[i].onchange = cambio;
		//Elementos[i].onblur = cambio;
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
		case "text":case "textarea":
			caracteresPermitidos = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ´ ";
			break;
		case "number":
			caracteresPermitidos = "0123456789";
			break;
		case "password":
			caracteresPermitidos= "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&'*+-/=?^_`{|}~(),:;<>@[]."
		default: 
			caracteresPermitidos="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@."
	}


	var letra = String.fromCharCode(evento.charCode);

	return caracteresPermitidos.indexOf(letra) != -1;
}
}

