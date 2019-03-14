import {IProductList, IOrderData, IOrderRowData } from './components/ISpWebShopProps';
import { sp } from "sp-pnp-js";



export interface IGetDataService {
    getData(): Promise<IProductList[]>;
    saveOrderData(title:string, user: number, date: string);
    getOrderData():Promise<IOrderData[]>;
    saveOrderRowData(OrderId: string, productId: string);
}

export class PNPDataService implements IGetDataService {
     
    public getData(): Promise<IProductList[]> {
        return sp.web.lists.getByTitle("Products").items.get().then((result) => {      
            return result;
            });
    }

    public saveOrderData(title:string, user: number, date: string){
        console.log("SaveOrderData", title);
        //getUser
        // sp.web.ensureUser('carlos.gonzales@companycarlos.onmicrosoft.com').then(r => {console.log(r)});
         sp.web.lists.getByTitle("Orders").items.add({    
            Title: title,
            ECWS_x002e_Date: date,
            ECWS_x002e_UserId: user,                     
        }).then(r => {
            
        });
    }

    public getOrderData():Promise<IOrderData[]>{
        return sp.web.lists.getByTitle("Orders").items.get().then((result) => {      
            return result;
            });
    }

    public saveOrderRowData(OrderId: string, productId: string){
        console.log("saveOrderRowData");      
        sp.web.lists.getByTitle("OrderRows").items.add({    
            Title: "Alpinskida",
            ECWS_x002e_OrderId: OrderId,
            ECWS_x002e_ProductId: productId                
        }).then(r => {            
                        
        });
  }
}


