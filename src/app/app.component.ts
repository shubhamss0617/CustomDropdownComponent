import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  dropdownDemoForm: FormGroup;
  countryList = [{
    'Code': '632005',
    'Description': 'ABSA'
  },
  {
    'Code': '430000',
    'Description': 'African Bank'
  },
  {
    'Code': '462005',
    'Description': 'Bidvest'
  },
  {
    'Code': '470010',
    'Description': 'Capitec'
  },
  {
    'Code': '250655',
    'Description': 'FNB / First National Bank'
  },
  {
    'Code': '580105',
    'Description': 'Investec'
  }, {
    'Code': '471001',
    'Description': 'Meeg Bank'
  },
  {
    'Code': '198765',
    'Description': 'Nedbank'
  },
  {
    'Code': '460005',
    'Description': 'Postbank'
  },
  {
    'Code': '051001',
    'Description': 'Std Bank / Standard Bank of SA'
  }
  ];
  ngOnInit() {
    this.dropdownDemoForm = new FormGroup({
      surname: new FormControl(null, [Validators.required, Validators.maxLength(55)]),
      countries: new FormControl(null, [Validators.required])
    });
  }
}
