import { TestBed } from '@angular/core/testing';

import { ElectronSrvService } from './electron-srv.service';

describe('ElectronSrvService', () => {
  let service: ElectronSrvService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectronSrvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
