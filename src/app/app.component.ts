import { Component } from '@angular/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  file: any = null
  fileInput = null
  title = 'cloudFunctionsClient';
  
  
  
  verificar()
  {
    if(this.file != null)
    {
      alert('Ok')
    }
    else
    {
      alert('No has subido una imagen')
    }
  }
  
  onFileSelected(event)
  {
    if(event.target.files.length > 0) 
    {
      const reader = new FileReader()
      reader.onload = (e:any) => {
        this.file = e.target.result
      }
      reader.readAsDataURL(event.target.files[0])
      console.log(event.target.files[0]);
    }
  }
}
