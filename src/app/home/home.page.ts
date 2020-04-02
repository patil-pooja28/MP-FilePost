import { Component } from '@angular/core';
import { ToastController, AlertController } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
 
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  link = "https://reqres.in/api/users?page=0&per_page=12";
  users: User[] = [];
  defaultImage = "https://s3.us-east-2.amazonaws.com/upload-icon/uploads/icons/png/20328691591561032548-256.png";
  constructor(
    private http: HttpClient,
    private toastController: ToastController,
    private alertController: AlertController
  ){
    http.get(this.link).subscribe(data => {
      this.users = data["data"];
    });
  }
  deleteUser(id) {
    const name =
      this.users[id].first_name +
      " " +
      this.users[id].last_name +
      " is deleted.";
    this.users.splice(id, 1);
    this.presentToast(name, "danger");
  }
  async editUser(id) {
    const alert = await this.alertController.create({
      header: "Edit User",
      inputs: [
        {
          name: "first_name",
          type: "text",
          // value:this.
          value: this.users[id].first_name
        },
        {
          name: "last_name",
          type: "text",
          value: this.users[id].last_name
        },
        {
          name: "email",
          type: "email",
          value: this.users[id].email
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Edit",
          handler: data => {
            this.users[id].first_name = data.first_name;
            this.users[id].last_name = data.last_name;
            this.users[id].email = data.email;
            console.log(this.users[id]);
            this.presentToast("User details edited", "success");
          }
        }
      ]
    });
    await alert.present();
  }
  async addUser() {
    const alert = await this.alertController.create({
      header: "Add User",
      inputs: [
        {
          name: "first_name",
          type: "text",
          placeholder: "First Name"
        },
        {
          name: "last_name",
          type: "text",
          placeholder: "Last Name"
        },
        {
          name: "email",
          type: "email",
          placeholder: "Email"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Add",
          handler: data => {
            this.users.unshift(data);
            this.http.post(this.link, data).subscribe(
              res => {
                this.presentToast("User added.", "success");
              },
              error => {
                this.users.splice(0, 1);
                this.presentToast("User not added.", "warning");
              }
            );
          }
        }
      ]
    });
 
    await alert.present();
  }
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      color: color,
      message: message,
      duration: 900
    });
    toast.present();
  }
}