import * as React from 'react';
import styles from './ModalItem.module.scss';


// export interface IModalProductState {
//     item: [{Id:string, Title:string, Price:string, Category:string, ImageUrl:string, imageUrlDesc: string}];
// }

export interface IModalProductProps {
    modalClosed: () => void;
    saveItem: () => void;   
    Id: string;
    Title: string;
    Price: string;
    Category: string;
    ImageUrl: string;
}

export default class Modal extends React.Component<IModalProductProps, {}> {
    constructor(props: IModalProductProps) {
        super(props); 
    }

   
    public render(): React.ReactElement<IModalProductProps> {
        return (
            <div>
                <div className={styles.Backdrop} onClick={this.props.modalClosed}></div>
                <div className={styles.Modal}>
                <div className={styles.ProductContainer}>
                    <div className={styles.ImageContainer}>
                        <img className={styles.modalPhoto}
                            src={this.props.ImageUrl}
                            alt="https://cdn.intersport.se/productimages/690x600/144369501000_10.jpg"
                        />
                    </div>
                    <div className={styles.ProductInfo}>
                    <div className={styles.ProductInfoElement}>{this.props.Title}</div>
                    <div className={styles.ProductInfoElement}>{this.props.Price} kr</div>
                    </div>  
                    </div>                
                    <div className={styles.AddItemButton}>
                        <button onClick={this.props.modalClosed}>Cancel</button>
                        <button onClick={this.props.saveItem}>Add to Basket</button>
                    </div>
                </div>
            </div>
        );
    }
}


