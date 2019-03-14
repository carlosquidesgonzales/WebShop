import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'SpWebShopWebPartStrings';
import SpWebShop from './components/SpWebShop';
import { ISpWebShopProps } from './components/ISpWebShopProps';
import { IGetDataService, PNPDataService } from './Services';

export interface ISpWebShopWebPartProps {
  description: string;
}

export default class SpWebShopWebPart extends BaseClientSideWebPart<ISpWebShopWebPartProps> {

  public render(): void {
    let service: IGetDataService;
    service = new PNPDataService();  

    service.getData().then((result) => {
    const element: React.ReactElement<ISpWebShopProps > = React.createElement(
      SpWebShop,
      {
        description: this.properties.description,
        products:result,
        saveOrderData: service.saveOrderData,
        saveOrderRowData: service.saveOrderRowData,
        getOrderData: service.getOrderData
      }
    );

    ReactDom.render(element, this.domElement);
  });
}

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
