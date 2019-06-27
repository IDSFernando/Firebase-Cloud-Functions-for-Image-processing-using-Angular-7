import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireStorage } from '@angular/fire/storage'
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'

import { Router, NavigationExtras } from '@angular/router'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  ngOnInit() {
  } 
  @ViewChild("video")
  public video: ElementRef;
  @ViewChild("canvas")
  public canvas: ElementRef;

  public captures:any = [];


  analyzedPicture:any = null


  file: any = null
  fileInput = null
  title = 'cloudFunctionsClient';
  _file:any
  
  uploadPercent: Observable<number> = null
  downloadURL: Observable<string> = null
  
  __docRef:any = null


  labels: any = []

  constructor(
    private firestorage: AngularFirestore,
    private storage: AngularFireStorage,
    private functions:HttpClient,
    private router: Router,
    )
    {}
    
    
    verificar()
    {
      if(this._file != null)
      {
        this.upload()
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
        this._file = event.target.files[0]
        reader.readAsDataURL(event.target.files[0])
        console.log(event.target.files[0])
      }
    }
    
    getFileId(filePath:any)
    {
      if(filePath.includes('.JPG'))
      {
        return filePath.split('.JPG')[0]
      }
      else if(filePath.includes('.jpg'))
      {
        return filePath.split('.jpg')[0]
      }
      else if(filePath.includes('.png'))
      {
        return filePath.split('.png')[0]
      }
      else if(filePath.includes('.PNG'))
      {
        return filePath.split('.PNG')[0]
      }
      else
      {
        return 'invalid image'
      }
    }
    
    upload()
    {
      const filePath = this._file.name
      const fileId = this.getFileId(filePath)
      if(fileId != 'invalid image')
      {
        const fileRef = this.storage.ref(filePath);
        this.__docRef = fileRef
        const task = this.storage.upload(filePath, this._file)
        this.uploadPercent = task.percentageChanges()
        
        task.snapshotChanges().pipe(
        finalize(
          () => this.downloadURL = fileRef.getDownloadURL()
          )
        ).subscribe()
        let docRef = this.firestorage.collection("photos").doc(fileId)
        docRef.snapshotChanges().subscribe(res => {
          this.analyzedPicture = res.payload.data()
          this.readTags(res.payload.data())
        })
        
        this.uploadPercent = null
      }
      else
      {
        alert('La imágen no es válida')
      }
    }

    upload_from_webcam(image:any)
    {
      const filePath = image.name
      const fileId = this.getFileId(filePath)
      if(fileId != 'invalid image')
      {
        // const fileId = filePath.split('.JPG')[0]
        const fileRef = this.storage.ref(filePath);
        this.__docRef = fileRef
        const task = this.storage.upload(filePath, this._file)
        this.uploadPercent = task.percentageChanges()
        
        task.snapshotChanges().pipe(
        finalize(
          () => this.downloadURL = fileRef.getDownloadURL()
          )
        ).subscribe()
          
        let docRef = this.firestorage.collection("photos").doc(fileId)
        docRef.snapshotChanges().subscribe(res => {
          this.analyzedPicture = res.payload.data()
          this.readTags(res.payload.data())
        })
        
        this.uploadPercent = null
      }
      else
      {
        alert('La imágen no es válida')
      }
    }


    goToDetailsView(_url)
    {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          "analisis": JSON.stringify(this.analyzedPicture),
          "image": JSON.stringify(_url)
        }
      }
      
      this.router.navigate(["details"], navigationExtras)
    }

    takePhoto()
    {
      if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
      {
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          this.video.nativeElement.srcObject = stream
          this.video.nativeElement.play()
          setTimeout(() => {
            this.canvas.nativeElement.getContext('2d').drawImage(this.video.nativeElement, 0,0, 800,600)
            this._file = this.canvas.nativeElement.toDataURL('image/png')
            console.log(this._file)
            fetch(this._file)
            .then(res => res.blob())
            .then(blob => {
              const file = new File([blob], "generated.jpg")
              this._file = file
              return this.upload_from_webcam(file)
            })
            stream.getVideoTracks().forEach(function (track) {
                track.stop();
            })
          }, 500);
        })
      }
    }

    readTags(tags:any)
    {
      console.log(tags.labels)
      // yeah, has to be this way
      setTimeout(() => {
        const json_tags = tags.labels
        console.log(json_tags)
        this.labels = json_tags
        return Promise.resolve(this.labels)
      }, 1000);
    }

}
