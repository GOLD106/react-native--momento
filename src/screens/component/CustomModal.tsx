import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  Modal,
} from "react-native";

import { MaterialIcons} from '@expo/vector-icons'; 
import deleteBtnBg from "../../assets/btns/deleteBtnBg.png";
import cancelBtnBg from "../../assets/btns/cancelBtnBg.png";
import { scaleX } from "../../core/theme/dimensions";

const totalStars = 5;

function CustomModal({ modalVisible, modalIcon, renderModalTxtContent, modalSubTxt, primaryBtnTxt, cancelBtnTxt , 
  isRating, ratingVal,  primaryAction, cancelAction }: 
  {
    modalVisible: boolean, 
    modalIcon: object,
    renderModalTxtContent: Function,
    modalSubTxt: string,
    primaryBtnTxt: string,
    cancelBtnTxt: string,
    isRating: boolean,
    ratingVal: number,
    primaryAction: Function,
    cancelAction: Function
  }) { 
    
   const renderStarIcon = () => {
    return (
        <View style={styles.starContainer}>
          <View style={styles.starContent}>
            {
              Array.from({length: ratingVal}, (x, i) => {
              return(
                <MaterialIcons key={i} name="star" size={32} color="#FFCA45"/>
                
              )
              })
            }
            {
              Array.from({length: totalStars - ratingVal}, (x, i) => {
              return(
                <MaterialIcons key={i} name="star-border" size={32} color="#F4F4F4" />
              )
              })
            }
          </View>
        </View>
      )
   }

  return (   
    <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {isRating ?
            renderStarIcon()
          : <Image source={modalIcon} style={styles.imgIcon} />
          }
          <View style={styles.modalTextContent}>
            {renderModalTxtContent()}
          </View>
          {modalSubTxt && 
            <Text style={styles.modalSubTxt}>{modalSubTxt}</Text>
          }
          <View style={styles.btnContainer}>
            <ImageBackground source={cancelBtnBg} resizeMode="cover" 
              style={styles.cancelBtn}>
              <TouchableOpacity style={styles.modalBtn} onPress={() => cancelAction()}>
                <Text style={styles.btnTxt}>{cancelBtnTxt}</Text>
              </TouchableOpacity>
            </ImageBackground>
            {
              primaryBtnTxt && 
              <ImageBackground source={deleteBtnBg} resizeMode="cover" 
                style={styles.primaryBtn}>
                  <TouchableOpacity style={styles.modalBtn} onPress={() => primaryAction()}>
                    <Text style={styles.btnTxt}>{primaryBtnTxt}</Text>
                  </TouchableOpacity>
              </ImageBackground>
            }
            
          </View>
        </View>
        
      </View>
    </Modal>
  );
}


const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    maxWidth: scaleX(260),
    maxHeight: scaleX(240),
    backgroundColor: '#343434',
    borderRadius: scaleX(10),
    padding: scaleX(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgIcon: {
    marginTop: scaleX(10),
    height: scaleX(58),
    resizeMode: 'contain'
  },
  modalTextContent: {
    marginTop: scaleX(19),
    marginBottom: scaleX(9),
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: scaleX(19),
  },
  modalSubTxt: {
    fontSize:scaleX(12),
    fontWeight: '500',
    color: '#ffffffE6',
    textAlign: 'center'
  },
  cancelBtn: {
    width: scaleX(112),
    height: scaleX(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scaleX(10),
    borderRadius: scaleX(5),
  },
  btnTxt: {
    fontSize: scaleX(14),
    fontWeight: '500',
    lineHeight: scaleX(17),
    color: 'white'
  },
  primaryBtn: {
    width: scaleX(112),
    height: scaleX(28),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleX(5),
  },
  starContainer: {
    paddingTop: scaleX(8),
    paddingRight: scaleX(4),
    marginTop: scaleX(20),
  },
  starContent: {
    flexDirection : "row",    
    paddingRight: scaleX(3),
    paddingLeft: scaleX(3),
    borderRadius: scaleX(24),
  },
  modalBtn: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',    
  }
})

export default CustomModal ;