import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { IncidentStoreState } from '@root/store';

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.scss']
})
export class IncidentListComponent implements OnInit, OnChanges {
  @Input() incidents: IncidentStoreState.Incident[];

  @Output() create = new EventEmitter();
  @Output() edit = new EventEmitter<IncidentStoreState.Incident>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  definedColumns = ['id', 'title', 'date', 'actions'];
  get empty(): boolean {
    return (this.incidents ?? []).length === 0;
  }

  dataSource = new MatTableDataSource<IncidentStoreState.Incident>();

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.incidents) {
      this.dataSource.data = (this.incidents ?? []);
      this.dataSource._updateChangeSubscription();
    }
  }
}
