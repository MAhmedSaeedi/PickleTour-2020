
import React,{PureComponent} from 'react'
import { View } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown';
import { inputButtonContainer } from './inputFieldContainer';
import { selectButton } from './inputField';

export class Select extends PureComponent {
    _handleChange = value => {
      this.props.onChange(this.props.value, value);
     
      
    };
    _handleTouch = () => {
      this.props.onTouch(this.props.name);
    };
  
    render() {
      const {label, data, error, style, editable, withIcon, ...rest} = this.props;
      return (
     
          
          <View style={{paddingBottom:20}}>
              <Dropdown
              style={selectButton}
              data={data}
              
              inputContainerStyle={{borderBottomColor: 'transparent'}}
              onChangeText={this._handleChange}
              onBlur={this._handleTouch}
              {...rest}
            />
          </View>
         
    
      );
    }
  }