import * as React from 'react';
import styles from './Poll.module.scss';
import { IPollProps } from './IPollProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class Poll extends React.Component<IPollProps, {}> {
  public render(): React.ReactElement<IPollProps> {
    return (
      <div className={ styles.poll }>
        <div className={ styles.container }>
          <div className={ styles.row }>
            <div className={ styles.column }>
              <span className={ styles.title }>Welcome to SharePoint!</span>
              <p className={ styles.subTitle }>Customize SharePoint experiences using Web Parts.</p>
              <p className={ styles.description }>{escape(this.props.pollTitle)}</p>
              <p className={ styles.description }>{escape(this.props.pollGUID)}</p>
              <a href="https://aka.ms/spfx" className={ styles.button }>
                <span className={ styles.label }>Learn more</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
