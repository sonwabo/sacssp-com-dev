import {
  Component,
  Input,
  OnInit,
  OnDestroy, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList,
} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {FormGroup, FormControl, Validators, FormBuilder, FormArray, NgModel} from '@angular/forms';
import {
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbDialogService,
  NbToastrService,
  NbWindowService,
} from '@nebular/theme';
import {UserManagementService} from '../../../jbpm/service/user-management.service';
import {DialogWithBackdropComponent} from '../../../jbpm/common-component/dialog/dialog-with-backdrop.component';
import {UserDetails} from '@app/authentication/model/user.details';
import {fromEvent, Observable, Subscription, timer} from 'rxjs';
import {DataShareService} from '@app/jbpm/service/data-share.service';
import {DocumentService} from '@app/jbpm/service/document.service';
import {Document} from '@app/jbpm/domain/document';
import {COMPONENT_LIST} from '@app/pages/jbpm/utils/routes-list-enum';
import {WindowsDialogComponent} from '@app/jbpm/common-component/window-dialog/window-dialog.component';
import {NbAuthJWTToken, NbAuthService} from '@nebular/auth';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';


@Component({
  selector: 'ngx-case-file',
  templateUrl: './case-file.component.html',
  styleUrls: ['./case-file.component.scss'],
})

export class CaseFileComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() case: any = null;
  @Input() taskSummary?: Promise<any>;
  @Input() documentsResponse: any;


  // @ViewChild('input_name1') input_name1: ElementRef;
  // @ViewChild('surname') input_name1: ElementRef;
  // @ViewChild('input_name1') input_name1: ElementRef;
  // @ViewChild('input_name1') input_name1: ElementRef;
  //


  // this.getFormValue('name1').length > 0 &&  this.getFormValue('citizenship').length > 0 &&
  // this.getFormValue('title').length > 0 &&
  // this.getFormValue('surname').length > 0  &&
  // new Date(this.getFormValue('birthdate')).toLocaleDateString().length > 0) {


  readonly titlesList: Array<any> = ['Prof', 'Dr', 'Mrs', 'Miss', 'Mr', 'Ms'];
  readonly genderList: Array<any> = ['Female', 'Male', 'Other'];
  readonly languageList: Array<any> = ['Afrikaans', 'English', 'Pedi', 'Zulu', 'Swati', 'Xhosa', 'Ndebele', 'Sotho', 'Venda', 'Tswana', 'Xitsonga'];
  readonly maritalStatusList: Array<any> = ['Single', 'Married'];
  readonly ethnicalStatusList: Array<any> = ['White', 'Coloured', 'Black', 'Indian', 'Chinese'];
  readonly disabilityStatusList: Array<any> = ['Yes', 'No'];
  readonly provinceNameList: Array<any> = ['MP', 'GP', 'WC', 'NC', 'EC', 'FS', 'Lim', 'NW', 'KZN'];
  readonly districtnameList: Array<any> = ['Buffalo City Metropolitan',
    'City of Cape Town Metropolitan',
    'City of Ekurhuleni Metropolitan',
    'City of Johannesburg Metropolitan',
    'City of Tshwane Metropolitan',
    'eThekwini Metropolitan',
    'Mangaung Metropolitan',
    'Nelson Mandela Bay Metropolitan',
    'Alfred Nzo District',
    'Amajuba District',
    'Amathole District',
    'Bojanala Platinum District',
    'Cape Winelands District',
    'Capricorn District',
    'Central Karoo District',
    'Chris Hani District',
    'Dr Kenneth Kaunda District',
    'Dr Ruth Segomotsi Mompati District',
    'Ehlanzeni District',
    'Fezile Dabi District',
    'Frances Baard District',
    'Garden Route District',
    'Gert Sibande District',
    'Harry Gwala District',
    'iLembe District',
    'Joe Gqabi District',
    'John Taolo Gaetsewe District',
    'King Cetshwayo District',
    'Lejweleputswa District',
    'Mopani District',
    'Namakwa District',
    'Ngaka Modiri Molema District',
    'Nkangala District',
    'OR Tambo District',
    'Overberg District',
    'Pixley Ka Seme District',
    'Sarah Baartman District',
    'Sedibeng District',
    'Sekhukhune District',
    'Thabo Mofutsanyana District',
    'Ugu District',
    'uMgungundlovu District',
    'uMkhanyakude District',
    'uMzinyathi District',
    'uThukela District',
    'Vhembe District',
    'Waterberg District',
    'West Coast District',
    'West Rand District',
    'Xhariep District',
    'ZF Mgcawu District',
    'Zululand District',
  ];



  readonly nationalityList: Array<any> = ['South Africa', 'Other'];
  readonly qualificationNameList: Array<any> = ['National Certificate: Community Development',
    'Further Education and Training Certificate: Community Development',
    'Bachelor of Community Development'];
  readonly qualificationLevelList: Array<any> = [
    'Level 1: Grade 9',
    'Level 2: Grade 10 and National (vocational) certificates level 2',
    'Level 3: Grade 11 and National (vocational) certificates level 3',
    'Level 4: Grade 12 (national senior certificate) and National (vocational) certificate. Level 4',
    'Level 5: Higher certificates and Advanced national (vocational) certificate.',
    'Level 6: National diploma and Advanced certificates',
    'Level 7: Bachelor\'s degree, Advanced diplomas, Post graduate certificate and B-Tech',
    'Level 8: Honours degree, Post graduate diploma and Professional qualifications\n',
    'Level 9: Master\'s degree',
    'Level 10: Doctor\'s degree'];
  readonly durationList: Array<any> = ['One year', 'Two years',
    'Three years', 'Four years', 'Five years', 'Six years'];

  readonly universityNamesList: Array<any> =
    ['Stellenbosch University (SU)', 'Walter Sisulu University (WSU)',
      'University of the Free State (UFS)', 'University of Cape Town (UCT)',
      'University of the Western Cape (UWC)', 'University of Fort Hare (UFH)',
      'University of the Witwatersrand (WITS)', 'University of Johannesburg (UJ)',
      'University of Pretoria (UP)', 'University of Venda (UNIVEN)',
      'University of South Africa (UNISA)', 'University of Limpopo (UL)',
      'University of Zululand (UZ)', 'University of Kwa-Zulu Natal (UKZN)', 'Other'];

  readonly sectorNamesList: Array<any> = ['Private Sector',
    'Public sector (national, provincial and local level)',
    'NPO', 'CBO', 'FBO', 'Academia', 'Private Practice', 'Other'];
  readonly disclaimerList: Array<string> = ['Yes', 'No'];
  readonly DOCS_STORAGE_KEY: string = 'documents';

  menuItems: Array<string>; // = ['Welcome', 'All users', 'Create user profile', 'Edit user profile'];

  userForm: FormGroup;
  productForm: FormGroup;

  submitted = false;
  loading = false;
  doYouHaveFormalEducation: string = '';
  isReadOnly: boolean = false;
  calendar: string = 'calendar';
  isCommunityPractitioner: any;
  birthdateStr: string;
  yearcompletedStr: string;
  message: string;
  subscription: Subscription;
  timerSubscription: Subscription;
  enableSaveButton: boolean = false;
  enableSaveButtonStr: string = 'false';

  haveQualification: boolean;

  citizenshipCount: any;
  practitionerCount: any;

  contactInformationTab: boolean = true;
  demographicInformationTab: boolean = true;
  academicInformationTab: boolean = true;
  employmentInformationTab: boolean = true;
  supportingDocumentsTab: boolean = true;

  subscriptions: any[];
  raceDisabilityArray: Array<string> = new Array<string>();

  isAdminUser: boolean = false;

  @ViewChildren(NgModel) myInputRef: QueryList<NgModel>;

  constructor(
    protected usermanagenent: UserManagementService,
    protected documentService: DocumentService,
    protected dataShare: DataShareService,
    protected toastrService: NbToastrService,
    protected dialogService: NbDialogService,
    protected windowService: NbWindowService,
    protected router: Router,
    private fb: FormBuilder,
    protected authService: NbAuthService,
    protected http: HttpClient) {

    this.initialiseUseerFormControl();
    this.enableSaveButton = false;
    this.enableSaveButtonStr = 'false';
    this.prepopulateData();

    this.authService.onTokenChange()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.getPayload()?.['roles'].includes('ADMIN')) {
          this.isAdminUser = true;
          this.menuItems = ['Welcome', 'All users', 'Create user profile', 'Edit user profile'];
        } else {
          this.menuItems = ['Welcome', 'Create user profile', 'Edit user profile'];
        }
      });

    this.productForm = this.fb.group({
      quantities: this.fb.array([]) ,
    });
    //this.productForm.controls.quantities.setValue(['One', 'Two']);
  }


  selectedMenuItem(value: string): void {

    if ('Edit user profile' === value) {
      this.router.navigate([COMPONENT_LIST.WELCOME]);
      this.searchAndUpdateUserProfile();
    } else if ('All users' === value) {
      this.router.navigate([COMPONENT_LIST.ALL_USERS]);
    } else if ('Create user profile' === value) {
      this.router.navigate([COMPONENT_LIST.CREATE_USER_PROFILE]);
    } else if ('Welcome' === value) {
      this.router.navigate([COMPONENT_LIST.WELCOME]);
    }
  }
  private searchAndUpdateUserProfile(): void {
    this.windowService.open(WindowsDialogComponent, {
      context: {
        title: 'Search for user',
        message: `User Data has been Created Successfully, User Reference has been generated
         ,also an email with the generated reference has been sent to your email`,
      },
    });
  }

  checked( contrls: string[], event: any) {
    this.doYouHaveFormalEducation =  (event === 'true') ? 'No' : 'Yes';
    this.disableFormElements(contrls, (event === 'true'));
  }


  private prepopulateData() {
    this.usermanagenent.getCitizenCount().subscribe(res => {
      this.populateControlIfEmpty('southafricancitezen', res.southafricans);
      this.populateControlIfEmpty('nonsouthafricancitezen', res.nonsouthafricans);
    });
    this.usermanagenent.getCountOfCommunityAndNonCommunityEmployees().subscribe(res => this.practitionerCount = res);
  }

  ngOnInit(): void {

    if (this.case != null) {
      this.loadData();
      this.disableFormElements(['disclaimer']);
    }

    this.subscription = this.dataShare.currentMessage.subscribe(msg => {
      this.message = msg;
      this.enableSaveButton = ('enable' === msg);
      this.enableSaveButtonStr = (this.enableSaveButton) ? 'true' : 'false';
    });

  }

  pauseProcessing = true;
  ngAfterViewInit(): void {

      this.timerSubscription = timer(0, 3000).subscribe(() => {
        if ( this.pauseProcessing ) {
          this.personalInformation();
          if ( !this.contactInformationTab) {
            this.contactInformation();
          }
          if ( !this.demographicInformationTab ) {
             this.demographicInformation();
          }
          if (!this.academicInformationTab ) {
             this.academicInformation();
          }
          if ( !this.employmentInformationTab ) {
             this.employmentInformation();
          }
        }
      });


    // fromEvent(this.input_name1.nativeElement, 'input')
    //   .pipe(map((event: Event) => (event.target as HTMLInputElement).value))
    //   .pipe(debounceTime(3000))
    //   .pipe(distinctUntilChanged())
    //   .subscribe(data => this.notTypingStuff());

   // this.timerSubscription = timer(0, 3000).subscribe(() => {
   //       this.userForm.controls.
   // });
 //   this.reactiveForm.get("firstname").valueChanges.subscribe(selectedValue => {

   // });
   //   this.userForm.get(['name1', 'title', 'surname', 'bithdate', 'citizenship']).valueChanges.subscribe( v => {
   //        console.log(' This is done ');
   //        console.log(v);
   //   });


     console.log( 'Hello Papi' ) ;
  }

  notTypingStuff(): void {

    if ( this.pauseProcessing ) {
      this.personalInformation();
      if ( !this.contactInformationTab) {
        this.contactInformation();
      }
      if ( !this.demographicInformationTab ) {
        this.demographicInformation();
      }
      if (!this.academicInformationTab ) {
        this.academicInformation();
      }
      if ( !this.employmentInformationTab ) {
        this.employmentInformation();
      }
    }
  }

  onfocus(): void {}

  private stopOrStartProcessing(value: boolean): void {
     this.pauseProcessing = value;
  }

  private personalInformation(): void {

    if (this.contactInformationTab === true &&
      ((this.idValid !== null && this.idValid === true) || this.getFormValue('passport').length > 0 )
      &&

      this.getFormValue('name1').length > 0 &&  this.getFormValue('citizenship').length > 0 &&
      this.getFormValue('title').length > 0 &&
      this.getFormValue('surname').length > 0  &&
      new Date(this.getFormValue('birthdate')).toLocaleDateString().length > 0) {
      this.stopOrStartProcessing(false);
      this.dialogService.open(DialogWithBackdropComponent, {
        context: {
          title: 'Data successfully captured',
          message: `Contact information`,
          flag: 'success-tab',
          size: 'tiny',
        },
      }).onClose.subscribe(() => {
        this.contactInformationTab = false;
        this.stopOrStartProcessing(true);
      });
    }
  }

  private contactInformation(): void {

    if (this.demographicInformationTab === true &&
      this.getFormValue('email').length > 0 &&
      this.getFormValue('cellphone').length > 0 &&
      this.getFormValue('houseorcomplexnameandnumber').length > 0 &&
      this.getFormValue('suburbname').length > 0  &&
      this.getFormValue('provincename').length > 0 &&
      this.getFormValue('postalcode').length > 0
    ) {
      this.stopOrStartProcessing(false);
      this.dialogService.open(DialogWithBackdropComponent, {
        context: {
          title: 'Data successfully captured',
          message: `Demographic information`,
          flag: 'success-tab',
          size: 'tiny',
        },
      }).onClose.subscribe(() => {
        this.demographicInformationTab = false;
        this.stopOrStartProcessing(true);
      });
    }
  }


  private demographicInformation(): void {

    if (this.academicInformationTab === true &&
      this.getFormValue('gender').length > 0 &&
      this.getFormValue('language').length > 0 &&
      this.getFormValue('maritalstatus').length > 0 &&
      this.getFormValue('ethnicalstatus').length > 0  &&
      this.getFormValue('disabilitystatus').length > 0 ) {
      this.stopOrStartProcessing(false);
      this.dialogService.open(DialogWithBackdropComponent, {
        context: {
          title: 'Data successfully captured',
          message: `Academic information`,
          flag: 'success-tab',
          size: 'tiny',
        },
      }).onClose.subscribe(() => {
        this.academicInformationTab = false;
        this.stopOrStartProcessing(true);
      });
    }
  }


  private academicInformation(): void {

    if ( this.employmentInformationTab === true && this.doYouHaveFormalEducation === 'No') {

      this.stopOrStartProcessing(false);
      this.dialogService.open(DialogWithBackdropComponent, {
        context: {
          title: 'Data successfully captured',
          message: `Employment information`,
          flag: 'success-tab',
          size: 'tiny',
        },
      }).onClose.subscribe(() => {
        this.employmentInformationTab = false;
        this.stopOrStartProcessing(true);
      });
    } else if (this.employmentInformationTab === true &&
      this.getFormValue('institutionname').length > 0 &&
      this.getFormValue('qualificationname').length > 0 &&
      new Date(this.getFormValue('yearcompleted')).toLocaleDateString().length > 0 &&
      this.getFormValue('qualificationlevel').length > 0 &&
      this.getFormValue('universityobtained').length > 0 ) {

      this.stopOrStartProcessing(false);
      this.dialogService.open(DialogWithBackdropComponent, {
        context: {
          title: 'Data successfully captured',
          message: `Employment information`,
          flag: 'success-tab',
          size: 'tiny',
        },
      }).onClose.subscribe(() => {
        this.employmentInformationTab = false;
        this.stopOrStartProcessing(true);
      });
    }
  }

  private employmentInformation(): void {

    if (this.supportingDocumentsTab === true &&
      this.getFormValue('employername').length > 0 &&
      this.getFormValue('sectorofemployment').length > 0 &&
      this.getFormValue('jobtitle').length > 0 &&
      this.getFormValue('iscommunitypractitioner').length > 0 &&
      this.getFormValue('empbusinessparknameorunitname').length > 0 &&
      this.getFormValue('emptownname').length > 0 &&
      this.getFormValue('empprovincename').length > 0 &&
      this.getFormValue('empworknumber').length > 0 &&
      this.getFormValue('empemail').length > 0 ) {
      this.stopOrStartProcessing(false);
      this.dialogService.open(DialogWithBackdropComponent, {
        context: {
          title: 'Data successfully captured',
          message: `Supporting documents`,
          flag: 'success-tab',
          size: 'tiny',
        },
      }).onClose.subscribe(() => {
        this.supportingDocumentsTab = false;
        this.stopOrStartProcessing(true);
        this.dataShare.changeMessage('enable');

      });
    }
  }

  enableTabs(): void {

    this.contactInformationTab = false;
    this.demographicInformationTab = false;
    this.academicInformationTab = false;
    this.employmentInformationTab = false;
    this.supportingDocumentsTab = false;
    this.dataShare.changeMessage('enable');
  }


  private loadData() {


    this.populateControlIfEmpty('title', this.case['title']);
    this.populateControlIfEmpty('name1', this.case['name1']);
    this.populateControlIfEmpty('name2', this.case['name2']);
    this.populateControlIfEmpty('name3', this.case['name3']);
    this.populateControlIfEmpty('surname', this.case['surname']);
    this.populateControlIfEmpty('maidensurname', this.case['maidensurname']);
    this.populateControlIfEmpty('birthdate', this.convertToDate(this.case['birthdate']));
    this.populateControlIfEmpty('idnumber', this.case['idnumber']);
    this.populateControlIfEmpty('passport', this.case['passport']);
    this.populateControlIfEmpty('citizenship', this.case['citizenship']);

    let gender = '';
    if (this.case['gender'] === 'MALE') {
       gender = 'Male';
    } else if (this.case['gender'] === 'FEMALE') {
      gender = 'Female';
    }
    this.populateControlIfEmpty('gender', gender);
    this.populateControlIfEmpty('language', this.case['language']);
    this.populateControlIfEmpty('maritalstatus', this.case['maritalstatus']);

    const arr = this.case['ethnicalstatus']?.split(',') as Array<string>;
    let race = '';
    let disabilityState = '';
    if ( arr.length > 1) {
        disabilityState = arr[1];
        race = arr[0];
    } else {
      race = arr[0];
    }


    this.populateControlIfEmpty('ethnicalstatus', race);
    this.populateControlIfEmpty('disability', disabilityState);

    this.populateControlIfEmpty('disabilitystatus', this.case['disabilitystatus']);
    this.populateControlIfEmpty('citizenship', this.case['citizenship']);
    // Saving district in disability status

    this.populateControlIfEmpty('cellphone', this.case['cellphone']);
    this.populateControlIfEmpty('worknumber', this.case['worknumber']);
    this.populateControlIfEmpty('email', this.case['email']);

    this.populateControlIfEmpty('houseorcomplexnameandnumber', this.case['houseorcomplexnameandnumber']);
    this.populateControlIfEmpty('streetnumberandname', this.case['streetnumberandname']);
    this.populateControlIfEmpty('suburbname', this.case['suburbname']);
    this.populateControlIfEmpty('townname', this.case['townname']);
    this.populateControlIfEmpty('provincename', this.case['provincename']);
    this.populateControlIfEmpty('postalcode', this.case['postalcode']);
    // this.populateControlIfEmpty('districtname', this.case['disabilitystatus']);
    // Saving district in disability status


    this.haveQualification = ( this.case['institutionname'] !== undefined
                 &&  this.case['qualificationname'] !== null) ? true : false;


    this.populateControlIfEmpty('institutionname', this.case['institutionname']);
    this.populateControlIfEmpty('institutiontel', this.case['institutiontel']);
    this.populateControlIfEmpty('qualificationname', this.case['qualificationname']);


    this.populateControlIfEmpty('yearcompleted', this.convertToDate(this.case['yearcompleted']));
    this.populateControlIfEmpty('qualificationlevel', this.case['qualificationlevel']);
    this.populateControlIfEmpty('durationofcourse', this.case['durationofcourse']);
    this.populateControlIfEmpty('universityobtained', this.case['universityobtained']);


    this.populateControlIfEmpty('employername', this.case['employername']);
    this.populateControlIfEmpty('sectorofemployment', this.case['sectorofemployment']);
    this.populateControlIfEmpty('jobtitle', this.case['jobtitle']);
    this.populateControlIfEmpty('iscommunitypractitioner', this.case['iscommunitypractitioner']);


    this.populateControlIfEmpty('empbusinessparknameorunitname', this.case['empbusinessparknameorunitname']);
    this.populateControlIfEmpty('empstreetnameandnumber', this.case['empstreetnameandnumber']);
    this.populateControlIfEmpty('empsuburbname', this.case['empsuburbname']);
    this.populateControlIfEmpty('emptownname', this.case['emptownname']);
    this.populateControlIfEmpty('empprovincename', this.case['empprovincename']);
    this.populateControlIfEmpty('emppostalcode', this.case['emppostalcode']);

    this.populateControlIfEmpty('empcellphone', this.case['empcellphone']);
    this.populateControlIfEmpty('empworknumber', this.case['empworknumber']);
    this.populateControlIfEmpty('empemail', this.case['empemail']);
    this.populateControlIfEmpty('disclaimer', 'Yes');

    this.enableTabs();

    const courses = this.case['durationofcourse'].split(',') as Array<string>;
    courses.forEach(value_ => this.quantities().push(this.newQuantity(value_)));
  }

  ngOnDestroy() {
    this.dataShare.clearStorageForKey(this.DOCS_STORAGE_KEY);
    this.enableSaveButton = false;
    this.enableSaveButtonStr = 'false';
    this.subscription.unsubscribe();
    this.timerSubscription.unsubscribe();
  }

  idValid: any = null;
  public validateId(value: any, type: string): void {

    if ( type === 'passport') {
    //  this.userForm.controls['citizenship'].setValue('No');
    } else {
    //  this.userForm.controls['citizenship'].setValue('Yes');
    }

    value = (value == null) ? this.userForm.controls[`${type}`].value : value;

    if (value.length === 0) {
      return;
    }

    if (type === 'idnumber' && value.length !== 13 && !isNaN(value) ) {
      this.showToast('South African Id Number must be 13 digits long', false, 'warning');
      //this.userForm.controls[`${type}`].reset();
      //this.userForm.controls['citizenship'].reset();
      return;
    }

    this.usermanagenent.validateIdentification(value, type).subscribe(res => {
      this.idValid = true;
      if (res?.response === 'exists') {
        this.idValid = false;
        this.showToast('Identification already exists, please inserts new', false, 'warning');
        this.userForm.controls[`${type}`].reset();
      //  this.userForm.controls['citizenship'].reset();
      }
      if (res?.response === 'text') {
        this.idValid = false;
        this.showToast('South African Id Number must be numbers only', false, 'warning');
        this.userForm.controls[`${type}`].reset();
        //this.userForm.controls['citizenship'].reset();
      }
    }, err => this.handleError(`Error trying to validate ${type}`));

  }

  quantities(): FormArray {
    return this.productForm.get('quantities') as FormArray;
  }

  newQuantity(value: string = ''): FormGroup {
    const cntrl = this.fb.group({
      otherqualificationname: value,
    });
    //cntrl.disable({onlySelf: (value.length > 0)});
    return cntrl;
  }

  addQuantity() {
    this.quantities().push(this.newQuantity());
  }

  removeQuantity(i: number) {
    this.quantities().removeAt(i);
  }

  private convertToDate(dateStr: string): Date {
    return new Date(dateStr);
  }

  disableFormElements(list: string[], event: boolean = true): void {

    list.forEach((contrl) => {
      this.userForm.controls[`${contrl}`].reset('');
      if (event) {
        this.userForm.controls[`${contrl}`].disable({onlySelf: true});
      } else {
        this.userForm.controls[`${contrl}`].enable({onlySelf: true});
      }
    });
  }

  get form() {
    return this.userForm.controls;
  }

  dateTime(event: any, cntrl: string): void {
    const date = new Date(event.value)
      .toLocaleDateString('en-ZA', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      }); // 08/19/2020 (month and day with two digits)
    if ('birthdate' === cntrl) {
      this.birthdateStr = date;
    } else {
      this.yearcompletedStr = date;
    }

    this.onfocus();
  }

  private initialiseUseerFormControl() {
    this.userForm = new FormGroup({
      title: new FormControl('', Validators.required),
      name1: new FormControl('', Validators.required),
      name2: new FormControl('', []),
      name3: new FormControl('', []),
      surname: new FormControl('', Validators.required),
      maidensurname: new FormControl('', []),


      birthdate: new FormControl('', Validators.required),
      idnumber: new FormControl('', []),
      passport: new FormControl('', []),
      citizenship: new FormControl('', Validators.required),

      gender: new FormControl('', Validators.required),
      language: new FormControl('', Validators.required),
      maritalstatus: new FormControl('', Validators.required),
      ethnicalstatus: new FormControl('', Validators.required),
      disabilitystatus: new FormControl('', []),
      disability: new FormControl('', []),

      cellphone: new FormControl('', Validators.required),
      worknumber: new FormControl('', []),
      email: new FormControl('', [Validators.required, Validators.email,  Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),

      houseorcomplexnameandnumber: new FormControl('', []),
      streetnumberandname: new FormControl('', Validators.required),
      suburbname: new FormControl('', []),
      townname: new FormControl('', Validators.required),
      provincename: new FormControl('', Validators.required),
      postalcode: new FormControl('', Validators.required),


      institutionname: new FormControl('', []),
      institutiontel: new FormControl('', []),
      qualificationname: new FormControl('', []),

      yearcompleted: new FormControl('', []),
      qualificationlevel: new FormControl('', []),
      durationofcourse: new FormControl('', []),
      universityobtained: new FormControl('', []),


      employername: new FormControl('', []),
      sectorofemployment: new FormControl('', []),
      jobtitle: new FormControl('', []),
      iscommunitypractitioner: new FormControl('', Validators.required),


      empbusinessparknameorunitname: new FormControl('', []),
      empstreetnameandnumber: new FormControl('', []),
      empsuburbname: new FormControl('', []),
      emptownname: new FormControl('', []),
      empprovincename: new FormControl('', []),
      emppostalcode: new FormControl('', []),

      empcellphone: new FormControl('', []),
      empworknumber: new FormControl('', []),
      empemail: new FormControl('', []),
      disclaimer: new FormControl('', Validators.required),

      southafricancitezen: new FormControl('', []),
      nonsouthafricancitezen: new FormControl('', []),

    });

  }

  private getFormValue(controlName: string): any {
    return this.userForm.controls[`${controlName}`].value;
  }

  private populateControlIfEmpty(controlName: string, value: any): void {

    if (value === undefined || value == null) {
      return;
    }
    if (this.userForm.controls[`${controlName}`].value === '') {
      this.userForm.controls[`${controlName}`].setValue(value);
    }
  }

  private setEmptyDefaultValues(userdto: any): void {
    if ( this.doYouHaveFormalEducation === 'No') {
      userdto['institutionname'] = 'n/a';
      userdto['institutionname'] = 'n/a';
      userdto['institutiontel'] = 'n/a';
      userdto['qualificationname'] = 'n/a';
      userdto['yearcompleted'] = 'n/a';
      userdto['qualificationlevel'] = 'n/a';
      userdto['durationofcourse'] = 'n/a';
      userdto['universityobtained'] = 'n/a';
    }

  }

  formSubmit(userForm: FormGroup) {

    if ( userForm.value['disclaimer'] === '') {  this.showWarning('Please capture the disclaimer'); return; }

    this.submitted = true;
    console.log(this.userForm.errors);
    if (this.userForm.invalid) {
      this.showWarning();
      return;
    }

    const userdto = userForm.value;
    this.setEmptyDefaultValues(userdto);

    if (this.doYouHaveFormalEducation !== 'No' && this.productForm.value.quantities.length > 0) {
      let otherqualificationArray = new Array<string>();
      this.productForm.value.quantities.forEach( v => {
        otherqualificationArray.push(v.otherqualificationname);
      });
      userdto['durationofcourse'] = otherqualificationArray.join();
    }



    this.raceDisabilityArray.push(userdto['ethnicalstatus']);
    this.raceDisabilityArray.push(userdto['disability']);
    userdto['ethnicalstatus'] = this.raceDisabilityArray.join();
    delete userdto['disability'];

    userdto['birthdate'] = this.birthdateStr;
    userdto['yearcompleted'] = (this.doYouHaveFormalEducation === 'Yes') ? this.yearcompletedStr : '9999/01/01';
    // These we should not send to the database
    delete userdto['southafricancitezen'];
    delete userdto['nonsouthafricancitezen'];

    this.loading = true;

    if ( this.case !== undefined ) {
       userdto['userId'] = this.case.userId;
       userdto['reference'] = this.case.reference;
       userdto['disclaimer'] = 'Yes';
    }

    this.usermanagenent.createUser(userdto, '').subscribe( r => {
      this.loading = false;
      UserDetails.userReference = r.reference;
      UserDetails.userid = r.userid;

      const docs = this.dataShare.getValueFromLocalStorage(this.DOCS_STORAGE_KEY);

      if (docs !== null) {    this.quantities().push(this.newQuantity('Testing this Mother fucker'));

        (docs as Array<any>).forEach(value => {
          value['reference'] = r.userid;
          this.documentService.uploadDocument(value as Document)
            .subscribe(doc => console.log(doc), err => console.error(err.error));
        });
        this.dataShare.clearStorageForKey(this.DOCS_STORAGE_KEY);
      }

     if (this.case !== undefined && this.case?.userId !== undefined ) {

       this.dialogService.open(DialogWithBackdropComponent, {
         context: {
           title: 'User Updated Successfully',
           message: `Data has been updated Successfully`,
           flag: 'success',
         },
       });
     } else {

       this.dialogService.open(DialogWithBackdropComponent, {
         context: {
           title: 'Congratulations. Your personal user profile was created successfully',
           message: `${r.reference}`,
           flag: 'success',
         },
       }).onClose.subscribe(rer => {
         this.dataShare.changeMessage('disable');
         this.enableSaveButton = false;
         this.enableSaveButtonStr = 'false';
         this.router.navigate([COMPONENT_LIST.WELCOME]);
       });
     }

      this.usermanagenent.getUserById(r.userid).subscribe(ca => {
        this.case = ca;
        this.router.navigate(['pages/jbpm/case-detail'], {state: {data: {case: ca }}});
      });

    }, err => {
      this.loading = false;
      this.handleError(err.error.message);
    });
  }

  private formatDate(date: any): string {
    return new Date(date)
      .toLocaleDateString('en-ZA', {
        year: 'numeric', month: '2-digit', day: '2-digit'
      });
  }

  public selected(event: any): void {
    if (event.value === 'Yes') {
      //  this.enableSaveButton = true;
    } else {
      // this.enableSaveButton = false;
    }
  }

  handleError(error: string = 'Error') {
    this.toastrService.show(
      'Error',
      `Something went wrong`,
      {'position': NbGlobalPhysicalPosition.TOP_RIGHT, 'status': 'danger'});
  }

  private showToast(msg: string, navigate: boolean = true, _staus: NbComponentStatus = 'success'): void {
    // @ts-ignore
    this.toastrService.show(
      `${msg}`,
      ``,
      {
        destroyByClick: false,
        duplicatesBehaviour: undefined,
        duration: 3000,
        hasIcon: false,
        icon: undefined,
        iconPack: '',
        limit: 0,
        preventDuplicates: true,
        status: _staus,
        toastClass: '',
        // @ts-ignore
        position: 'top-end',
      });

    setTimeout(() => {
      if (navigate) {
        this.navigate();
      }
    }, 3000);
  }

  private navigate(): void {
    this.router.navigate(['pages/jbpm/cases-table'], {replaceUrl: true});
  }

  private showWarning(msg: string = 'Additional Fields required'): void {
    this.toastrService.show(
      `${msg}`,
      `Please capture required field`,
      {position: NbGlobalPhysicalPosition.TOP_RIGHT, status: 'warning'},
    );
  }

}
