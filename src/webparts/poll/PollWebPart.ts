import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneLabel
} from '@microsoft/sp-webpart-base';
import { PropertyFieldCollectionData, CustomCollectionFieldType } from '@pnp/spfx-property-controls/lib/PropertyFieldCollectionData';
import * as strings from 'PollWebPartStrings';
import Poll from './components/Poll';
import { } from '@microsoft/sp-lodash-subset';
import { Web } from 'sp-pnp-js';
import { IPollProps, IOption } from './components/IPollProps';

export interface IPollWebPartProps {
  pollTitle: string;
  guid: string;
  pollDataCollection: any[];
}



export default class PollWebPart extends BaseClientSideWebPart<IPollWebPartProps> {

  private _IspollOptionsSetupCompleted : boolean = false;


  public render(): void {
    const element: React.ReactElement<IPollProps> = React.createElement(
      Poll,
      {
        pollTitle: this.properties.pollTitle,
        pollGUID: this.properties.guid
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onAfterPropertyPaneChangesApplied() {
    console.log("POLL GUID is: " + this.properties["guid"]);
  }

  protected onPropertyPaneConfigurationStart() {
    if (!this.properties["guid"]) {
      this.properties["guid"] = this.guidGenerator();
      console.log("GUID IS NOW SET");
      this.context.propertyPane.refresh();
    }

    if(this.properties.pollDataCollection && this.properties.pollDataCollection.length > 0){
      this._IspollOptionsSetupCompleted = true;
      this.context.propertyPane.refresh();
    }
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: any, newValue: any): void {
    if (propertyPath == "pollDataCollection" && newValue) {
      if(newValue && newValue.length > 0){
        this._IspollOptionsSetupCompleted = true;
        this.context.propertyPane.refresh();
      }      
    }
    else {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
    }
  }

  protected guidGenerator = (): string => {
    return (this.S4() + this.S4() + "-" + this.S4() + "-4" + this.S4().substr(0, 3) + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()).toLowerCase();

  }

  protected S4 = (): string => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  protected get disableReactivePropertyChanges() {
    return true;
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected pollTitleValidator = (value: string): string => {
    if (value.trim().length > 0) {
      return '';
    }

    return "Poll title cannot be left blank";
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.BasicGroupName,
              isCollapsed: false,
              groupFields: [
                PropertyPaneTextField('pollTitle', {
                  label: "Poll Title",
                  onGetErrorMessage: this.pollTitleValidator.bind(this)
                }),
                PropertyFieldCollectionData('pollDataCollection', {
                  key: "pollDataCollection",
                  label: "Poll Options",
                  manageBtnLabel: "Manage Poll Option",
                  panelHeader: "Add your poll options here",
                  fields: [
                    {
                      id: "option",
                      title: "Option",
                      placeholder: "Enter your poll option here",
                      type: CustomCollectionFieldType.string,
                      required: true
                    }
                  ],
                  value: this.properties.pollDataCollection,
                  disabled : this._IspollOptionsSetupCompleted
                }),
                PropertyPaneLabel('', {
                  text : "*Poll Options Setup can be done only once",
                })
              ]
            },
            {
              groupName: "Internal Use",
              isCollapsed: false,
              groupFields: [
                PropertyPaneLabel('', {
                  text: "This area is strictly used for Internal Processing of the webpart"
                }),
                PropertyPaneTextField('guid', {
                  label: "Poll GUID (internal property)",
                  disabled: true
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
