import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

type Tab = "Discover" | "Saved" | "Wallet" | "Settings";
type Creator = { id: string; name: string; category: string; description: string };
const CREATORS: Creator[] = [
  { id: "nova", name: "Nova", category: "Music", description: "Independent music and studio sessions." },
  { id: "kairo", name: "Kairo", category: "Gaming", description: "Gameplay, tutorials and community matches." },
  { id: "mira", name: "Mira", category: "Art", description: "Illustration, design and creative process." }
];
const SAVED_KEY = "extreme-pumps.non-adult.saved.v1";

export default function App() {
  const [tab, setTab] = useState<Tab>("Discover");
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(SAVED_KEY).then((raw) => {
      if (!active || !raw) return;
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) {
        setSavedIds(parsed.filter((id) => CREATORS.some((creator) => creator.id === id)));
      }
    }).catch(() => undefined).finally(() => { if (active) setReady(true); });
    return () => { active = false; };
  }, []);

  async function toggleSaved(id: string) {
    const next = savedIds.includes(id) ? savedIds.filter((value) => value !== id) : [...savedIds, id];
    setSavedIds(next);
    try { await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(next)); }
    catch { setSavedIds(savedIds); }
  }

  const visibleCreators = tab === "Saved" ? CREATORS.filter((c) => savedIds.includes(c.id)) : CREATORS;

  return <SafeAreaView style={styles.safe}>
    <StatusBar style="light" />
    <View style={styles.header}>
      <View><Text style={styles.brand}>EXTREME <Text style={styles.brandAccent}>PUMPS</Text></Text><Text style={styles.edition}>ANDROID · NON-ADULT EDITION</Text></View>
      <View style={styles.onlinePill}><Text style={styles.onlineText}>BETA SHELL</Text></View>
    </View>
    <View style={styles.notice}><Text style={styles.noticeTitle}>Community-first creator content</Text><Text style={styles.noticeText}>Music, gaming, art, education and other non-explicit creator content only.</Text></View>
    <View style={styles.tabs}>{(["Discover","Saved","Wallet","Settings"] as Tab[]).map((item) =>
      <Pressable key={item} onPress={() => setTab(item)} style={[styles.tab, tab === item && styles.activeTab]}>
        <Text style={[styles.tabText, tab === item && styles.activeTabText]}>{item}</Text>
      </Pressable>)}</View>
    <ScrollView contentContainerStyle={styles.content}>
      {!ready ? <ActivityIndicator color="#b8ff45" /> : null}
      {(tab === "Discover" || tab === "Saved") && <>
        <Text style={styles.heading}>{tab === "Saved" ? "Saved creators" : "Discover creators"}</Text>
        <Text style={styles.subheading}>Saved creator cards remain available offline on this device.</Text>
        {visibleCreators.length === 0 ? <Text style={styles.empty}>No saved creators yet. Save a creator from Discover.</Text> : null}
        {visibleCreators.map((creator) => <View key={creator.id} style={styles.card}>
          <View style={styles.avatar}><Text style={styles.avatarText}>{creator.name[0]}</Text></View>
          <View style={styles.creatorInfo}><Text style={styles.creatorName}>{creator.name}</Text><Text style={styles.category}>{creator.category}</Text><Text style={styles.description}>{creator.description}</Text></View>
          <Pressable onPress={() => toggleSaved(creator.id)} style={styles.saveButton}><Text style={styles.saveText}>{savedIds.includes(creator.id) ? "Saved" : "Save"}</Text></Pressable>
        </View>)}
        <Text style={styles.footnote}>Demo creator data only. Live profiles, uploads and streams are not connected.</Text>
      </>}
      {tab === "Wallet" && <View style={styles.panel}>
        <Text style={styles.heading}>Wallet & payments</Text><Text style={styles.subheading}>Solana Devnet is the planned beta network.</Text>
        <View style={styles.statusBox}><Text style={styles.statusTitle}>Not connected</Text><Text style={styles.description}>Wallet connection and token payments are disabled in this starter build. Never enter a seed phrase or private key into EXTREME PUMPS.</Text></View>
        <Text style={styles.footnote}>Digital-content purchases remain disabled until Google Play billing and blockchain policy requirements are reviewed and implemented.</Text>
      </View>}
      {tab === "Settings" && <View style={styles.panel}>
        <Text style={styles.heading}>Settings & safety</Text>
        <Text style={styles.description}>This Android edition is restricted to non-adult content. Explicit sexual content, adult creator discovery and adult-content links are out of scope.</Text>
        <Text style={styles.description}>Reporting, blocking, creator verification, age-appropriate content controls and account tools must be completed before public release.</Text>
        <Text style={styles.footnote}>Offline mode stores only the saved creator-card list locally. It does not cache private media, payment credentials or session tokens.</Text>
      </View>}
    </ScrollView>
    <View style={styles.footer}><Text style={styles.footerText}>EXTREME PUMPS · NON-ADULT · DEVELOPMENT BUILD</Text></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe:{flex:1,backgroundColor:"#090b10"},
  header:{paddingHorizontal:20,paddingTop:18,paddingBottom:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between"},
  brand:{color:"#f5f7f2",fontSize:23,fontWeight:"900",letterSpacing:1},
  brandAccent:{color:"#b8ff45"},
  edition:{color:"#9da5b1",fontSize:10,letterSpacing:1.5,marginTop:4},
  onlinePill:{borderWidth:1,borderColor:"#657d35",borderRadius:20,paddingHorizontal:10,paddingVertical:6},
  onlineText:{color:"#c6ff68",fontSize:10,fontWeight:"800"},
  notice:{marginHorizontal:16,padding:15,borderRadius:14,backgroundColor:"#172015",borderWidth:1,borderColor:"#34472a"},
  noticeTitle:{color:"#eaffd2",fontSize:16,fontWeight:"800"},
  noticeText:{color:"#b6c4ad",fontSize:13,lineHeight:19,marginTop:5},
  tabs:{flexDirection:"row",marginHorizontal:12,marginTop:16,backgroundColor:"#141821",borderRadius:12,padding:4},
  tab:{flex:1,paddingVertical:10,alignItems:"center",borderRadius:9},
  activeTab:{backgroundColor:"#b8ff45"},
  tabText:{color:"#aab2bf",fontSize:12,fontWeight:"700"},
  activeTabText:{color:"#10150a"},
  content:{padding:18,paddingBottom:30},
  heading:{color:"#f5f7f2",fontSize:23,fontWeight:"900",marginBottom:6},
  subheading:{color:"#aab2bf",fontSize:13,lineHeight:19,marginBottom:16},
  card:{backgroundColor:"#151a24",borderRadius:15,padding:14,marginBottom:11,flexDirection:"row",alignItems:"center",borderWidth:1,borderColor:"#252d3a"},
  avatar:{width:44,height:44,borderRadius:22,backgroundColor:"#29351d",alignItems:"center",justifyContent:"center",marginRight:12},
  avatarText:{color:"#c9ff7b",fontSize:20,fontWeight:"900"},
  creatorInfo:{flex:1},
  creatorName:{color:"#fff",fontSize:15,fontWeight:"800"},
  category:{color:"#c5f27b",fontSize:11,marginTop:2},
  description:{color:"#aab2bf",fontSize:12,lineHeight:18,marginTop:5},
  saveButton:{paddingHorizontal:12,paddingVertical:8,borderRadius:9,backgroundColor:"#27351c"},
  saveText:{color:"#d7ff9e",fontSize:11,fontWeight:"800"},
  footnote:{color:"#818b99",fontSize:11,lineHeight:17,marginTop:14},
  empty:{color:"#aab2bf",paddingVertical:22,textAlign:"center"},
  panel:{backgroundColor:"#151a24",borderRadius:15,padding:17,borderWidth:1,borderColor:"#252d3a"},
  statusBox:{backgroundColor:"#202631",padding:14,borderRadius:11,marginTop:8},
  statusTitle:{color:"#f3d38a",fontWeight:"800",marginBottom:5},
  footer:{padding:12,borderTopWidth:1,borderTopColor:"#252d3a",alignItems:"center"},
  footerText:{color:"#727d8b",fontSize:9,letterSpacing:1}
});