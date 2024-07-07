import { TestBed } from '@angular/core/testing';

import { CrudService } from './crud.service';
import { HttpClient, HttpClientModule, HttpParams } from '@angular/common/http';
import {  HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('CrudService', () => {
  let service: CrudService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule,HttpClientTestingModule ],
      providers: [
        { provide: HttpClientModule , HttpClient},
        
      ]
    });
    service = TestBed.inject(CrudService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify(); // Verify that there are no outstanding requests after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new restaurant', () => {
    const newRestaurant = {
      "id": "6",
      "name": "Fresh Delicacy6",
      "location": "Bengaluru",
      "description": "Fresh home cooked food",
      "cuisine": "Veg and Non-Veg",
      "phoneNumber": "912346789",
      "openingHours": "12:00 PM - 9:00PM",
      "website": "www.freshdelicacy6.com"
    };

    service.addRestaurant(newRestaurant).subscribe(response => {
      expect(response).toBeDefined(); 
      expect(response.name).toBe(newRestaurant.name);
      expect(response.cuisine).toBe(newRestaurant.cuisine);
    });

    const req = httpMock.expectOne(service.url);
    expect(req.request.method).toBe('POST');
    req.flush(newRestaurant);
  });

  it('should get all restaurants', () => {
    const mockRestaurants = [
      { id: '1', name: 'Restaurant A', cuisine: 'Thai' },
      { id: '2', name: 'Restaurant B', cuisine: 'Indian' }
    ];

    service.getAllRestaurants().subscribe(response => {
      expect(response).toEqual(mockRestaurants);
    });

    const req = httpMock.expectOne(service.url);
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurants);
  });

  it('should update a restaurant', () => {
    const updatedRestaurant = { id: '1', name: 'Updated Restaurant', cuisine: 'Mexican' };

    service.updateRestaurant(updatedRestaurant.id, updatedRestaurant).subscribe(response => {
      expect(response).toEqual(updatedRestaurant);
    });

    const req = httpMock.expectOne(`${service.url}/${updatedRestaurant.id}`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedRestaurant);
  });

  it('should delete a restaurant by ID', () => {
    const restaurantId = '1';

    service.deleteRestaurantById(restaurantId).subscribe(response => {
      expect(response).toBeDefined();
      expect(response.message).toBe('Restaurant deleted successfully');
    });

    const req = httpMock.expectOne(`${service.url}/${restaurantId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Restaurant deleted successfully' });
  });


});
