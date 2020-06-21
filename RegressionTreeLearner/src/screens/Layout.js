import {SafeAreaView, View, Text} from 'react-native';

export default function Layout(props) {
    console.log(props)

 return <SafeAreaView style={styles.container}>
     <View style={styles.innerContainer}>
         <Text style={styles.header}>
             RegressionTreeLearner
         </Text>
         <Text style={styles.credits}>
             by Gianfranco Demarco
         </Text>
         {props.children}
     </View>
 </SafeAreaView>
}
