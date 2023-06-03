let actividadModific = () => {}; 
let actividadElimin = () => {};
let actividadMostr = () => {};
let idModifcActivi = 1; 
let modificar = -1; 

$(document).ready(function(){
    var codigoEstudiante = localStorage.getItem('codigoEstudiante');
    console.log(codigoEstudiante);
    actividadMostr = function(){
         
    $.ajax({ 
        method: 'get', 
        url: 'http://localhost:8000/actividades', 
    }).done((response) => { 
        const dataJson = JSON.parse(response);
        const Actividades = dataJson.data; 
        const table = document.getElementById('ActividadesTb'); 
        const tbody = table.getElementsByTagName('tbody')[0]; 
        let html = ''; 
        let sumatoria = 0;
        let contador = 0;
            Actividades.forEach(Actividad => {
              if(Actividad.codigoEstudiante == codigoEstudiante){
              html += '<tr>';
              html += '   <td>' + Actividad.id + '</td>';
              html += '   <td>' + Actividad.descripcion + '</td>';
              html += '   <td>' + Actividad.nota + '</td>';
              html += '   <td>' + Actividad.codigoEstudiante + '</td>';
              html += '   <td>';
              html += '       <button onclick="actividadModific(' + Actividad.id + ')">MODIFICAR</button>';
              html += '   </td>';
              html += '   <td>';
              html += '       <button onclick="actividadElimin(' + Actividad.id + ')" >ELIMINAR</button>';
              html += '   </td>';
              html += '<tr>';
              sumatoria += parseFloat(Actividad.nota)
              contador += 1;
                }
            });
        let promedio = sumatoria/contador;
        if(promedio != 0){
            if(promedio >= 3){
                document.getElementById('promedio').innerText = 'Felicidades esta pasando la materia con: '+promedio 
                promedio = 0
            }else{
                document.getElementById('promedio').innerText = 'Lo sentimos esta perdiendo la materia con: '+promedio
                promedio = 0
            }
        }else
        {document.getElementById('promedio').innerText = 'No hay notas';}
        tbody.innerHTML = html;
        console.log(dataJson);
    }).fail((error) => {
        console.error(error);
    })
 }

    actividadMostr();

    document.getElementById('Guardar').addEventListener('click', ()=>{
    let formulario = document.forms['formularioActividad'];
    let descripcion = formulario['descripcion'].value;
    let nota = formulario['nota'].value;
    
    if(modificar == -1){
        $.ajax({
            url: 'http://localhost:8000/actividades', 
            method: 'post', 
            data:{
                descripcion: descripcion, 
                nota: nota,
                codigoEstudiante: codigoEstudiante
            }
        }).done(response =>{
            const dataJson = JSON.parse(response);
            const msg = dataJson.data ;
            alert(msg); 
            actividadMostr(); 
        });
    } else {
        $.ajax({
            url: 'http://localhost:8000/actividades/'+idModifcActivi,
            method: 'put',
            data:{
                descripcion: descripcion, 
                nota: nota,
                codigoEstudiante: codigoEstudiante
            }
        }).done(response =>{
            const dataJson = JSON.parse(response);
            const msg = dataJson.data;
            alert(msg);
            actividadMostr()
            modificar = -1
        })
  
    }   

    document.getElementById('descripcion')
        .setAttribute('value', '')
    document.getElementById('nota')
        .setAttribute('value', '')
    document.getElementById('formularioActividad').reset()
    })

    actividadModific = function(Actividadid){
        idModifcActivi = Actividadid
        $.ajax({
            url: 'http://localhost:8000/actividades/'+idModifcActivi,
            method: 'get',
        }).done(response =>{
            const dataJson = JSON.parse(response);
            const actividades= dataJson.data;
            document.getElementById('descripcion').setAttribute('value', actividades.descripcion)
            document.getElementById('nota').setAttribute('value', actividades.nota)
            })
        modificar = 1
    }    


    actividadElimin = function(Actividadid){
        idModifcActivi = Actividadid
        $.ajax({
            url: 'http://localhost:8000/actividades/'+idModifcActivi,
            method: 'delete',
        }).done(response =>{
            const dataJson = JSON.parse(response)
            const msg = dataJson.data 
            alert(msg)
            actividadMostr()
        })
    }

    })