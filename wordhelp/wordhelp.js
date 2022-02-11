function calcular_probabilidades(dicc)
{
	var prob = {};
	var len = dicc.lenght;
	dicc.forEach(function (palabra) {
		var pos = 1;
		for (const letra of palabra) {
			if (! prob[pos]) prob[pos] = {};
			if (! prob[pos][letra]) prob[pos][letra] = 0;
			prob[pos][letra]++;
			pos++;
		}
	});
	return prob;
}

function calcular_puntos(palabra, prob)
{
	var puntos = 1;
	var pos = 1;
	for (const letra of palabra) {
		if (prob[pos])
		{
			if (prob[pos][letra])
			{
				puntos *= prob[pos][letra];
			}
		}
		pos++;
	}
	return puntos;
}

function calcular_puntos_diccionario(dicc)
{
	var dicc_puntos = {}
	var prob = calcular_probabilidades(dicc);
	dicc.forEach(function (palabra) {
		dicc_puntos[palabra] = calcular_puntos(palabra, prob);
	});
	return dicc_puntos;
}

function ordenar_diccionario(dicc)
{
	var dicc_puntos = calcular_puntos_diccionario(dicc);
	return dicc.sort(function (a, b) {
		var pa = dicc_puntos[a];
		var pb = dicc_puntos[b];
		return pb - pa;
	});
}

function diccionario_no_contiene_letra(dicc, letra)
{
	var new_dicc = [];
	dicc.forEach(function (palabra) {
		if (! palabra.includes(letra)) new_dicc.push(palabra);
	});
	return new_dicc;
}

function diccionario_contiene_letra(dicc, letra)
{
	var new_dicc = [];
	dicc.forEach(function (palabra) {
		if (palabra.includes(letra)) new_dicc.push(palabra);
	});
	return new_dicc;
}

function palabra_incluye_letra_posicion(palabra, letra, pos)
{
	var pos_aux = 1
	for (const letra_aux of palabra) {
		if (pos_aux == pos)
		{
			if (letra_aux == letra)
			{
				return true;
			}
			return false;
		}
		pos_aux++;
	}
	return false;
}

function diccionario_contiene_letra_posicion(dicc, letra, pos)
{
	var new_dicc = [];
	dicc.forEach(function (palabra) {
		if (palabra_incluye_letra_posicion(palabra, letra, pos))
		{
			new_dicc.push(palabra);
		}
	});
	return new_dicc;
}

function extraer_sugerencias(dicc, num)
{
	var sugerencias = [];
	var i = 0;
	while (i < num)
	{
		if (dicc[i])
		{
			sugerencias.push(dicc[i]);
		}
		i++;
	}
	return sugerencias;
}

function actualizar()
{
	var dicc = diccionario;

	var $input_contiene = document.getElementById('input_contiene');
	if ($input_contiene)
	{
		var contiene = $input_contiene.value.toLowerCase();
		if (contiene)
		{
			for (const letra of contiene) {
				dicc = diccionario_contiene_letra(dicc, letra);
			}
		}
	}

	var $input_no_contiene = document.getElementById('input_no_contiene');
	if ($input_no_contiene)
	{
		var no_contiene = $input_no_contiene.value.toLowerCase();
		if (no_contiene)
		{
			for (const letra of no_contiene) {
				dicc = diccionario_no_contiene_letra(dicc, letra);
			}
		}
	}

	[1, 2, 3, 4, 5].forEach(function(n) {
		$input_letra = document.getElementById('input_letra_' + n.toString());
		if ($input_letra)
		{
			var letra = $input_letra.value.toLowerCase();
			if (letra)
			{
				dicc = diccionario_contiene_letra_posicion(dicc, letra, n);
			}
		}
	});

	dicc = ordenar_diccionario(dicc);
	var sugerencias = extraer_sugerencias(dicc, 5);

	$input_sugerencias = document.getElementById('input_sugerencias');
	if ($input_sugerencias)
	{
		$input_sugerencias.value = sugerencias.join(' ').toUpperCase();
	}
}

document.addEventListener('DOMContentLoaded', function() {
	document.querySelectorAll('input[data-actualizar]').forEach(function ($element) {
		$element.addEventListener('keyup', actualizar);
		$element.addEventListener('paste', actualizar);
		$element.addEventListener('click', actualizar);
		$element.addEventListener('change', actualizar);
	});
});