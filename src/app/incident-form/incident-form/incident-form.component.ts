import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IncidentStoreState } from '@root/store';

@Component({
  selector: 'app-incident-form',
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.scss']
})
export class IncidentFormComponent implements OnInit {
  @Output() closeEditor = new EventEmitter();
  @Output() save = new EventEmitter<IncidentStoreState.Incident>();

  @Input() incident: IncidentStoreState.Incident;

  form: FormGroup;
  title = 'Create Incident';

  constructor(fb: FormBuilder) {
    this.form = fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      summary: ['', [Validators.required]],
      date: [null, Validators.required],
      time: [null, Validators.required],
      location: [{ value: null, disabled: true }, []]
    });
  }

  ngOnInit() {
    if (this.incident) {
      this.title = `Edit: ${this.incident.id}`;

      this.form.patchValue({
        ...this.incident
      });
    }
  }

  onSave() {
    if (this.form.valid) {
      const formData = this.form.getRawValue();
      const updatedIncident = {
        ...this.incident,
        ...formData
      };

      this.save.emit(updatedIncident);
    }
  }
}
