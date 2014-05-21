package controllers;

import play.mvc.*;
import models.*;
import java.util.*;

public class TypingController extends Application{
	public static final int NUM_OF_WORDS = 20; // 1回のゲームでの出題単語数
	
	@Before
	static void _session_auth(){
        session_auth();
    }
	
    public static void main(long category_id){
    	Random rand = new Random();
    	Category category = Category.find("id = ?", category_id).first();
    	if (category == null)
    		MenuController.game_select();
    	
    	List<Word> allWords = category.words;
    	List<Word> words = new ArrayList<Word>();
    	// allWordsの要素をランダムに選択してwordsに移す 
    	while(words.size() < NUM_OF_WORDS){
    		int n = rand.nextInt(allWords.size());
    		words.add(allWords.remove(n));
    	}
    	
        render(category, words);
    }
	
    public static void result(Long category_id, int score, double time, int missCount){
    	checkAuthenticity();
    	UserData user = (UserData)renderArgs.get("current_user");
    	new History(user, category_id, score, time, missCount).save();
    	user.TotalScore += score;
    	user.save();
    	renderText(200);
     }
    
}