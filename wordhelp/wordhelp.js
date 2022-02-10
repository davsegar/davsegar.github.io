$input_contiene = document.getElementById('input_contiene');
$input_no_contiene = document.getElementById('input_no_contiene');
$input_sugerencias = document.getElementById('input_sugerencias');

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

function no_contiene_letra_diccionario(dicc, letra)
{
	var new_dicc = [];
	dicc.forEach(function (palabra) {
		if (! palabra.includes(letra)) new_dicc.push(palabra);
	});
	return new_dicc;
}

function contiene_letra_diccionario(dicc, letra)
{
	var new_dicc = [];
	dicc.forEach(function (palabra) {
		if (palabra.includes(letra)) new_dicc.push(palabra);
	});
	return new_dicc;
}

function actualizar()
{
	var dicc = diccionario;

	var contiene = $input_contiene.value;
	if (contiene)
	{
		for (const letra of contiene) {
			dicc = contiene_letra_diccionario(dicc, letra);
		}
	}

	var no_contiene = $input_no_contiene.value;
	if (no_contiene)
	{
		for (const letra of no_contiene) {
			dicc = no_contiene_letra_diccionario(dicc, letra);
		}
	}

	dicc = ordenar_diccionario(dicc);

	$input_sugerencias.value = '';
	var i = 0;
	while (i < 5)
	{
		if (dicc[i])
		{
			$input_sugerencias.value = $input_sugerencias.value + dicc[i] + ' ';
		}
		i++;
	}
}