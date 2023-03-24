import React, {useState, useEffect} from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
  TextInput
} from "react-native";
import mainBg from "../../assets/mainBg.png";
import downloadListIcon from "../../assets/deck/downloadListIcon.png";
import { connect } from "react-redux";
import {ApplicationState} from "../../redux";
import { NavigationScreenProp } from "react-navigation";
import cardDeck from "../../assets/common/cardDeck.png";
import jojo from "../../assets/common/jojo.png";
import Slider from '@react-native-community/slider';
import { useFonts,  Montserrat_500Medium, Montserrat_600SemiBold, Montserrat_700Bold} from '@expo-google-fonts/montserrat';
import {Inter_500Medium, Inter_700Bold} from '@expo-google-fonts/inter';
import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import TopBarLeftArrow from "../component/TobBarLeftArrow";
import { scaleX } from "../../core/theme/dimensions";
import cardBg from '../../assets/deck/createCard/cardBg.png'
import plusIcon from '../../assets/common/plusIcon.png'
import deleteIcon from '../../assets/common/deleteIcon.png'
import { TouchableOpacity } from "react-native-gesture-handler";
import { getFirestore, collection, onSnapshot, addDoc, doc, deleteDoc} from 'firebase/firestore';

interface Props {
  navigation: NavigationScreenProp<any, any>;
  userReducer: object;
  isSavePlayDeck: any
}


const _categoryList: React.FC<Props> = (props: Props) => { 
 
  const [cardCatList, setCardCatList] = useState<any>([])
  const [videoCatList, setVideoCatList] = useState<any>([])

  const [cardCat, setCardCat] = useState('')
  const [videoCat, setVideoCat] = useState('')

  useEffect(() => {
    const firestore = getFirestore()    
    const unsub = onSnapshot(collection(firestore, 'Category'), (querySnapshot) => {
      let cardCatList:any[] = []
      let videoCatList:any[] = []

      querySnapshot.docs.map((doc) => {       
        let catData = doc.data()
        let newData = {
          ...doc.data(),
          uid: doc.id
        }
        if(catData.catType == 'card') {
          cardCatList.push(newData)
        }
        else {
          videoCatList.push(newData)
        }
      });
      setCardCatList(cardCatList)
      setVideoCatList(videoCatList)
    });
    return () => unsub();
  }, [])

  const handleNavigate = (screen: string): void => {
    props.navigation.navigate(screen);
  };

  const renderCat = (catType: string) => {
    let selectedCatType = catType =='card' ? cardCatList : videoCatList
    console.log('rendercat', cardCatList)
    return (
      selectedCatType.map((item: any, index: number) => {
        return( 
          <View style={styles.inprogressItem} key={index}>
            <Text style={styles.catName}>{item.catName}</Text>
            <TouchableOpacity onPress={()=> deleteCat(item)}>
              <Image source={deleteIcon} style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        )
      })         
    )
  }

  const addCat = (catType: string) => {
    const firestore = getFirestore();
    const catName = catType == 'card' ? cardCat : videoCat
    addDoc(collection(firestore, "Category"), {
        catName,
        catType
     })
     .then((data) => {
       const uid = data.id
      
       setCardCat('')
       setVideoCat('')
     })
     .catch((e) => {
        console.log(e, 'add error')
     });
  }
  const deleteCat = (delItem: any) => {
    const firestore = getFirestore();
    deleteDoc(doc(firestore, 'Category', delItem.uid))
    .then(() => {      
      
      console.log('removed')
    })
    .catch((e) => {
      console.log(e, 'delete error')
    })
  }

  let [fontsLoaded] = useFonts({
    Montserrat_700Bold, Montserrat_600SemiBold, Montserrat_500Medium, 
    Inter_500Medium, Inter_700Bold, 
    Poppins_400Regular, Poppins_500Medium,  Poppins_600SemiBold, Poppins_700Bold
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={mainBg} resizeMode="cover" style={styles.mainImgBg}>
        <ScrollView style={styles.contentContainer}>  
          <View style={styles.titleWithBack}>
            <TopBarLeftArrow navigation={props.navigation} />
          </View>
          <View style={styles.mainContent}>          
           
            <View>
              <Text style={styles.inprogressTitle}>Card Category</Text>
              <View style={styles.inputareaContainer}>
                <ImageBackground source={cardBg} resizeMode="cover" style={[styles.txtareabgImg]}>            
                  <TextInput 
                      placeholder="Add" 
                      placeholderTextColor={'#968FA4'}
                      value={cardCat}
                      onChangeText={(txt) => setCardCat(txt)}
                      style={styles.inputStyle}/>
                  <TouchableOpacity onPress={()=> addCat('card')}>
                    <Image source={plusIcon} style={styles.plusIcon} />
                  </TouchableOpacity>
                  
                </ImageBackground>
              </View>
              {renderCat('card')}
              <Text style={styles.inprogressTitle}>Video Category</Text>
              <View style={styles.inputareaContainer}>
                <ImageBackground source={cardBg} resizeMode="cover" style={[styles.txtareabgImg]}>            
                  <TextInput 
                      placeholder="Add" 
                      placeholderTextColor={'#968FA4'}
                      value={videoCat}
                      onChangeText={(txt) => setVideoCat(txt)}
                      style={styles.inputStyle}/>
                  <TouchableOpacity onPress={()=> addCat('video')}>
                    <Image source={plusIcon} style={styles.plusIcon} />
                  </TouchableOpacity>
                  
                </ImageBackground>
              </View>
              {renderCat('video')}
            </View>
          
          </View>
        </ScrollView>
      </ImageBackground>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
  },
  contentContainer: {
    flex:1,
    padding: scaleX(25),
  },
  mainImgBg: {
    flex: 1,
    resizeMode: 'cover',
  },
  titleWithBack: {
    flexDirection: "row",
    alignItems: 'center',
    paddingRight: scaleX(37)
  },
  pgTitleTxt: {
    fontSize: scaleX(24),
    fontWeight: '600',
    lineHeight: scaleX(35),
    textAlign: 'center',
    color: '#EFEBF6',
    flex: 1,
    fontFamily: 'Montserrat_600SemiBold'
  },
  mainContent: {    
    paddingTop: 0,
    marginTop: scaleX(50),
    marginBottom: scaleX(80),
  },
  inprogressItem: {
    flexDirection: 'row',
    marginTop: scaleX(15),
    padding: scaleX(15),
    borderRadius: scaleX(14),
    backgroundColor: '#252A34',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  inprogressTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: scaleX(20),
    fontWeight: '700',
    lineHeight: scaleX(26),
    color: '#ffffff',
    marginTop: scaleX(18),
  },
  emptyDeckContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyDeckTitle: {
    marginTop: scaleX(74),
    fontSize: scaleX(26),
    lineHeight: scaleX(31),
    fontWeight: '600',
    textAlign: 'center',
    color: '#F4F4F4'
  },
  emptyDeckSubTitle: {
    marginTop: scaleX(21),
    fontSize: scaleX(18),
    lineHeight: scaleX(22),
    fontWeight: '600',
    textAlign: 'center',
    color: '#968FA4',
    maxWidth: scaleX(247),
    marginBottom: scaleX(80)
  },
  downloadListIcon: {
    width: scaleX(20),
    height: scaleX(23),
    resizeMode: 'contain',
    marginRight: scaleX(15),
  },  
  inputareaContainer: {
    borderWidth: scaleX(1),
    borderColor: '#A293BE',
    height: scaleX(67),
    borderRadius: scaleX(13.8),
    overflow: "hidden",
    marginTop: scaleX(24),
  },
  txtareabgImg: {
    flex: 1,
    paddingHorizontal: scaleX(20),
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputStyle: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: scaleX(19.7),
    lineHeight: scaleX(28.7),
    color: 'white',
    flex: 1,
  },
  plusIcon: {
    width: scaleX(20),
    height: scaleX(20),
    resizeMode: 'contain'
  },
  catName: {
    fontFamily: 'Montserrat_500Medium',
    fontWeight: '500',
    fontSize: scaleX(18),
    lineHeight: scaleX(22),
    color: '#f4f4f4',
  },
  deleteIcon: {
    width: scaleX(13.5),
    height: scaleX(15),
    resizeMode: 'contain'
  }
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
  isSavePlayDeck: state.isSavePlayDeck
});

const CategoryList = connect(mapStateToProps, { })(
  _categoryList
);

export default CategoryList;
