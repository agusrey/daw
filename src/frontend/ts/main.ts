class Main implements EventListenerObject, HandlerPost{
    public myFramework: MyFramework;
    public main(): void {
        console.log("Se ejecuto el metodo main!!!");
        this.myFramework = new MyFramework();
     
    }
    
    public handleEvent(ev: Event) {

        let objetoEv: HTMLInputElement = <HTMLInputElement>ev.target;
        let tipoEvento:string = ev.type;
        let tipoElemento:string = objetoEv.type;
        alert("evento tipo " + tipoEvento + "de un elemento " + tipoElemento);
        
        if(tipoElemento == "checkbox"){   //aca tenemos un evento de un on/off, hace un post para afectar el json
            alert("datos: " +  objetoEv.id + " " + objetoEv.checked) + " " + objetoEv.value;
            let valor:number = 0;
            if(objetoEv.checked==true){
                valor=1;
            }
            let id=parseInt(objetoEv.id.substring(6))-1;
            let datos = {"id":id, "state":valor};
            this.myFramework.requestPOST("http://localhost:8000/afecta_state", this, datos);
        }
        if(tipoEvento == "change"){   //aca tenemos un evento de un dimmer, idem
            alert("datos: " +  objetoEv.id + " " + objetoEv.value);
            let id=parseInt(objetoEv.id.substring(4))-1;
            let datos = {"id":id, "state":objetoEv.value};
            this.myFramework.requestPOST("http://localhost:8000/afecta_state", this, datos);


        }

        if(tipoElemento == "editBtn"){   //aca tenemos un evento de un botón de edicion, hay que determinar de cual dispositivo
            
        }

        if(tipoElemento == "deleteBtn"){   //aca tenemos un evento de un boton de borrado, hay que determinar de cual dispositivo
            alert("datos: " +  objetoEv.id + " " + objetoEv.value);
            let id=parseInt(objetoEv.id.substring(10))-1;
            let datos = {"id":id};
            if(this.ConfirmBox()){
                this.myFramework.requestPOST("http://localhost:8000/delete", this, datos);
                location.reload();
            }
            
        }
        
    }

    responsePost(status: number, response: string) {
        alert(response);
    }

    /*
    Este método despliega la lista de dispositivos y agrega los botones Edit y Delete
    Utiliza el objeto de AJAX XMLHttpRequest. Ajax es una herramienta que permite el funcionamiento asíncrono de la aplicación web,
    es decir que se pueden hacer peticiones a un servidor sin tener que volver a cargar la página.
    */


    public despliegaListaDisp(){
        /*Instancia el objeto xhr que es un XMLHttpRequest*/    
        let xhr: XMLHttpRequest = new XMLHttpRequest();
        
        /* este es el código que se va a ejecutar cuando suceda el evento onreadystatchange al terminar el request XMLHttpRequest*/
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {    /*la solicitud tuvo éxito*/
                    console.log(xhr.responseText);
                    let listaDis: Array<Device> = JSON.parse(xhr.responseText); //listaDis guarda un array de Device (definido en device.ts)

                    for (let disp of listaDis ){

                        let icono:string;   //este swich selecciona que ícono se va a mostrar según el tipo de dispositivo y lo guarda en icono
                        icono = this.ver_icono(disp.type);
                        
                        let control:number;
                        control = this.ver_control(disp.type);
                        
                        let listaDisp = this.myFramework.getElementById("listaDisp");
                        if(control==0){     //en este caso es on/off
                            listaDisp.innerHTML += 
                                `<li class="collection-item avatar">
                                    <img src=${icono} alt="" class="circle">
                                    <span id="nombre_${disp.id}" class="nombreDisp">${disp.name}</span>
                                    <p id="descripcion_${disp.id}">${disp.description}
                                    </p>
                                    <a href="#!" class="secondary-content">
                                        <div class="switch">
                                            <label >
                                                Off
                                                <input id="llave_${disp.id}" type="checkbox">
                                                <span class="lever"></span>
                                                On
                                            </label>
                                        </div>
                                    </a>
                                    <input id="tipodispositivo_${disp.id}" type="text" value="${disp.type}" hidden>
                                    <a id="btnEdit_${disp.id}" type="editBtn" class="waves-effect waves-light btn">Editar</a>
                                    <a id="btnDelete_${disp.id}" type="deleteBtn" class="waves-effect waves-light btn">Borrar</a> 
                                </li>`;
                        }else{     //en este caso es dimerizable
                            listaDisp.innerHTML += 
                            `   <li class="collection-item avatar">
                                    <img src=${icono} alt="" class="circle">
                                    <span class="nombreDisp">${disp.name}</span>
                                    <p>${disp.description}</p>
                                    <a href="#!" class="secondary-content">
                                        <div class="range-field">
                                            <input type="range" id="dim_${disp.id}" min="0" max="100" valor="${disp.state}"/>
                                        </div>
                                    </a>
                                    <a id="btnEdit_${disp.id}" type="editBtn" class="waves-effect waves-light btn">Editar</a>
                                    <a id="btnDelete_${disp.id}" type="deleteBtn" class="waves-effect waves-light btn">Borrar</a> 
                                </li>`;
                        }
                     
                        
                    }
                    // aca se definen los EventListener para los distintos elementos que se fueron agregando
                    for (let disp of listaDis) {
                        //checkDisp = this.myFramework.getElementById("nombreDisp_" + disp.id);
                        //checkDisp.addEventListener("click", this);
                        //Control dimerizable - on/off
                        if(this.ver_control(disp.type) == 1){
                            //es dimerizable
                            let dimmer = this.myFramework.getElementById("dim_" + disp.id);
                            dimmer.addEventListener("change", this);
                        }else{
                            //es on/off
                            let llave = this.myFramework.getElementById("llave_"+ disp.id);
                            llave.addEventListener("click", this);
                        }
                        //Botones edit
                        let btnEdit = this.myFramework.getElementById("btnEdit_" + disp.id);
                        btnEdit.addEventListener("click",this);
                        
                        //Botones delete 
                        let btnDelete = this.myFramework.getElementById("btnDelete_" + disp.id);
                        btnDelete.addEventListener("click",this);
                       
                    }
                } else {
                    alert("error!!")
                }
            }
        }
        xhr.open("GET","http://localhost:8000/devices",true);
        xhr.send();
        console.log("Envio el send");

    }
    public ver_icono(tipo:number):string {
        switch(tipo){
            case 0:
            case 1:
                return "./static/images/lightbulb.png";
            case 2:
            case 3:
                return "./static/images/lamp2.png";
            case 4:
                return "./static/images/persiana.png";
        }
    }
    public ver_control(tipo:number):number{
        switch(tipo){  //este swich selecciona si es on/off o dimerizable y pone la variable control en 0 si es on/off y en 1 si es dimerizable
            case 1:
            case 3:
            case 4:
                return 1; //1= dimerizable
            default:
                return 0;  //0= on/off
        }
    }
    public ConfirmBox():boolean{
        return confirm("¿Está seguro de borrar el dispositivo?");
    }
}
// Aqui se define lo que se va a ejecutar cuando termine de cargar la página
window.addEventListener("load", ()=> {
    let miObjMain: Main = new Main();
    miObjMain.main();
    miObjMain.despliegaListaDisp();
});



