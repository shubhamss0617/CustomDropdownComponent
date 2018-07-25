import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    SimpleChange,
    forwardRef,
    ElementRef,
    ViewChild,
    HostListener,
    AfterViewInit,
    ViewChildren,
    QueryList,
    style,
    ChangeDetectorRef
} from '@angular/core';

import {
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS,
    FormControl,
    Validator,
    AbstractControl
} from '@angular/forms';
@Component({
    selector: 'app-custom-dropdown',
    templateUrl: './custom-dropdown.component.html',
    styleUrls: ['./custom-dropdown.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CustomDropdownComponent),
            multi: true
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => CustomDropdownComponent),
            multi: true
        }
    ]
})
export class CustomDropdownComponent
    implements ControlValueAccessor, Validator, OnChanges , AfterViewInit {
    showDropdownOptions = false;
    @Input() defaultText;
    @Input() dataList: any[];
    @Input() current: any;
    @Output() selectedValue = new EventEmitter<any>();
    private optionsPlaceholder: ElementRef;
    @ViewChild('dropOptions') set content(optionsPlaceholder: ElementRef) {
        if (!!optionsPlaceholder) {
            this.optionsPlaceholder = optionsPlaceholder;
        }
    }
    shownValue;
    _eref;
    valid: boolean = null;
    control: AbstractControl;
    elemFocus = false;
    private value;
    arrowkeyLocation = 0;
    keyCodes = {
        enterKey: 13,
        escKey: 27,
        upKey: 38,
        downKey: 40,
        click: 1
    };
    valueSelectedFlag = false;
    wildcard = '';
    filteredSearchResult = [];
    searchFiltering = false;
    globalDataCopy;
    private propagateChange = (_: any) => {};
    constructor(private element: ElementRef, private cd: ChangeDetectorRef) {
        this._eref = element;
    }

    ngOnChanges(change: SimpleChanges) {
        if (change['dataList'] && change['dataList'].currentValue && (change['dataList'].currentValue !== change['dataList'].previousValue)) {
            this.globalDataCopy = change['dataList'].currentValue;
        }

        if (change['current'] && !change['current'].firstChange) {
            if (change['current'].currentValue !== this.value) {
                this.onChange(change['current'].currentValue);
            }
        }
    }

    ngAfterViewInit() {
        this._eref.nativeElement.firstChild.addEventListener('mouseenter', () => {
            this.elemFocus = true;
        });
        this._eref.nativeElement.firstChild.addEventListener('mouseleave', () => {
            this.elemFocus = false;
        });
        this._eref.nativeElement.firstChild.addEventListener('click', (event) => {
            if (event.which === this.keyCodes.click && this.valueSelectedFlag) {
                this.showDropdownOptions = false;
            }
            this.valueSelectedFlag = false;
        });

        this._eref.nativeElement.addEventListener('keydown', (event) => {
            if (this.elemFocus) {
                this.showDropdownOptions = true;
                switch (event.which) {
                    case this.keyCodes.enterKey:
                        event.preventDefault();
                        this.showDropdownOptions = false;
                        if (this.searchFiltering) {
                            this.onChange(this.globalDataCopy[this.arrowkeyLocation]);
                        } else {
                            this.onChange(this.dataList[this.arrowkeyLocation]);
                        }
                        break;
                    case this.keyCodes.escKey:
                        this.showDropdownOptions = false;
                        break;
                    case this.keyCodes.upKey:
                        if (this.arrowkeyLocation > 0) {
                            this.arrowkeyLocation--;
                            this.optionsPlaceholder.nativeElement.scrollTop -= 50;
                        }
                        event.preventDefault();
                        break;
                    case this.keyCodes.downKey:
                        if (this.arrowkeyLocation < this.dataList.length - 1) {
                            this.arrowkeyLocation++;
                            this.optionsPlaceholder.nativeElement.scrollTop += 50;
                        }
                        event.preventDefault();
                        break;
                     default:
                        if (event.which >= 65 && event.which <= 90) {
                            this.filteredSearchResult = [];
                            if (this.showDropdownOptions) {
                                this.searchFiltering = true;
                                this.wildcard = this.wildcard.concat(event.key);
                                this.highlightOption(this.wildcard);
                                this.globalDataCopy = this.filteredSearchResult;
                            }
                        }
                }
            }
        });
    }

    closeFiltering() {
        if (this.searchFiltering) {
            this.shownValue = null;
            this.wildcard = '';
            this.searchFiltering = false;
            this.filteredSearchResult = [];
            this.globalDataCopy = this.dataList;
        }
    }

    highlightOption(searchString) {
        this.shownValue = searchString;
        this.dataList.forEach((item, index) => {
            const found = item.Description.substr( 0,  searchString ? searchString.length : 0).toUpperCase() === (searchString || '').toUpperCase();
            if (found) {
                this.filteredSearchResult.push(this.dataList[index]);
            }
        });
    }

    public writeValue(obj: any) {
        if (obj !== undefined && obj !== null) {
            if (this.dataList && this.dataList.length > 0) {
                const retrivedValue = this.dataList.find((item, i) => {
                    return item.Code === obj || item.Description === obj;
                });

                if (retrivedValue) {
                    this.shownValue = retrivedValue.Description;
                }
            }
        }
    }
    public registerOnChange(fn: any) {
        this.propagateChange = fn;
    }
    public registerOnTouched() {}
    public validate(c: AbstractControl) {
        const currentValue = c.value;
        const isValid = currentValue !== null;

        if (!this.control) {
            this.control = c;
        }

        this.valid = isValid;

        return isValid
            ? null
            : {
                  valid: false
              };
    }
    toggleDropdownOptions() {
        if (this.control) {
            this.control.markAsTouched();
            this.control.updateValueAndValidity();
        }

        this.showDropdownOptions = this.showDropdownOptions ? false : true;
    }

    onChange(data) {
        this.valueSelectedFlag = true;
        this.populate(data);
    }

    populate(data) {
        this.value = data;
        if (data === null) {
            this.shownValue = null;

            if (this.control) {
                this.control.markAsPristine();
            }
        } else {
            this.shownValue = data.Description;
            if (this.control) {
                this.control.markAsDirty();
            }
        }
        this.selectedValue.emit(data);
        this.propagateChange(this.shownValue);
        this.arrowkeyLocation = this.dataList.findIndex((item, i) => {
            return data === item;
        });
        this.showDropdownOptions = false;
    }

   @HostListener('document:click', ['$event.target'])
    handleClick(event) {
        let clickedComponent = event;
        let inside = false;
        do {
            if (clickedComponent === this._eref.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.showDropdownOptions = false;
        }
    }
}
