import * as React from 'react';
import styles from './SpWebShop.module.scss';
import { ISpWebShopProps, IProductList, IOrders, IOrderData  } from './ISpWebShopProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { Pivot, PivotItem, PivotLinkFormat,PivotLinkSize } from 'office-ui-fabric-react/lib/Pivot';
import ModalItem from './ModalItem/ModalItem';
import Orders from './Orders/Orders';

export interface IWebShopState {
  items: IProductList[];
  orderItems: IOrders[];
  registeredOrders: IOrderData[];
  Id: string;
  Title: string;
  Price: string;
  Category: string;
  ImageUrl: string;
  mouseOver: boolean;
  showModal: boolean;
  totalItem: number; 
  pageOfItems: {}; 
}

export default class SpWebShop extends React.Component<ISpWebShopProps, IWebShopState> {
  constructor(props: ISpWebShopProps) {
    super(props);

    
    //var productItems = this.props.products.map(i => ({ id: i.Id, title:i.Title, price:i.ECWS_x002e_Price, imageUrl:i.ECWS_x002e_ImageUrl}));
    this.state = {
      items: this.props.products,
      mouseOver: false,
      showModal: false,
      Id: '',
      Title: '',
      Price: '',
      Category: '',
      ImageUrl: '',
      totalItem: 0,
      orderItems: [],
      registeredOrders: [],
      pageOfItems: {}
    };
    this._clickHandler = this._clickHandler.bind(this);
    this.CloseModalHandler = this.CloseModalHandler.bind(this);
    this.SaveOrder = this.SaveOrder.bind(this);
    this.CancelOrderHandler = this.CancelOrderHandler.bind(this);
    this.ProceedToCheckout = this.ProceedToCheckout.bind(this);
  }

  private _clickHandler(id: string, title: string, price: string, category: string, imageUrl: string, imageUrlDesc: string) {
    this.setState({
      showModal: !this.state.showModal,
      Id: id,
      Title: title,
      Price: price,
      Category: category,
      ImageUrl: imageUrl,
    });
  }

  
  private CloseModalHandler() {
    this.setState({ showModal: !this.state.showModal });
    console.log("Modal", this.state.showModal);
  }

  private CancelOrderHandler(index:number, e){
    const myList = [...this.state.orderItems];
        myList.splice(index, 1);
        
        this.setState({orderItems: myList});
        console.log("Clicked", index);
        console.log("NewItemOrder", this.state.orderItems);
  }

  
  

  private SaveOrder = () => {
    this.setState({ showModal: !this.state.showModal });
    this.setState({ totalItem: this.state.totalItem + 1 });
    this.setState(prevState => ({
        orderItems: [...prevState.orderItems, {
          Key: new Date().toJSON(),
          Id: this.state.Id,
          Title: this.state.Title,
          Price: this.state.Price,
          Category: this.state.Category,
          ImageUrl:this.state.ImageUrl,
        }]
    }));
    console.log(this.state.orderItems);
  }

  private ProceedToCheckout(title: string, user: number, date: string){
    
    this.props.saveOrderData(title, user, date);
    

    setTimeout(() => {
      this.props.getOrderData().then((result)=>{
        console.log("result",result);
        this.setState({registeredOrders:result});
      });
    }, 1000);
    

    setTimeout(() => {   
      let lastItem = this.state.registeredOrders[this.state.registeredOrders.length-1];
      this.state.orderItems.forEach(element => {
        this.props.saveOrderRowData(lastItem.Id, element.Id);
      });
      this.setState({orderItems: []});
    }, 2000);
  }


  
  
  
  
  public render(): React.ReactElement<ISpWebShopProps> {
    let items = [];
    items = this.state.items.map((item) => {
      return (
        <div className={styles.tile} key={item.Id}>
          <div className={styles.ProductItem} >
            <img className={styles.Images}

              onClick={this._clickHandler.bind(this,
                item.Id,
                item.Title,
                item.ECWS_x002e_Price,
                item.ECWS_x002e_Category,
                item.ECWS_x002e_ImageUrl.Url,
                item.ECWS_x002e_ImageUrl.Description,
              )}
              src={item.ECWS_x002e_ImageUrl.Url}
              alt={item.ECWS_x002e_ImageUrl.Description}
            />
            <div className={styles.Price}>{item.ECWS_x002e_Price} kr</div>
            <div className={styles.ProductInfo}>
            <div>{item.Title}</div>
          </div>
          </div>         
        </div>
      );
    });

    return (
      <div className={ styles.spWebShop }>
        <div className={ styles.container }>
          <div className={ styles.row }>
                                  
          <Pivot linkFormat={PivotLinkFormat.tabs} linkSize={PivotLinkSize.large}>
          <PivotItem headerText="Home">
            <Label><h3 style={{textAlign: 'center'}}>Just Sport</h3>
             <hr/>
            </Label>
            <div className={styles.tiles}>
            {this.state.showModal ?
                        <ModalItem modalClosed={this.CloseModalHandler} saveItem={this.SaveOrder}
                          Id={this.state.Id}
                          Title={this.state.Title}
                          Price={this.state.Price}
                          Category={this.state.Category}
                          ImageUrl={this.state.ImageUrl}
                           /> : null}
            {items}
            </div>          
          </PivotItem>
          <PivotItem itemIcon="ShoppingCart" itemCount={this.state.orderItems.length} >
          <Label><h3 style={{textAlign: 'center'}}>Just Sport</h3>
             <hr/>
            </Label>
            <Orders listOrders={this.state.orderItems} 
                    cancelOrder={this.CancelOrderHandler.bind(this)} 
                    totalItems={this.state.orderItems.length}
                    checkout={this.ProceedToCheckout.bind(this)} />} />
          </PivotItem>
        </Pivot>       
          </div>
        </div>
      </div>
    );
  }
}
