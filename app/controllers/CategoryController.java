package controllers;

import java.util.List;

import play.mvc.*;
import models.*;

public class CategoryController extends Application{
	
	@Before
	static void auth(){
        session_auth();
    }
	
	public static void index(){
		render();
	}
	
	public static void registed_words(){
		
		Category category = Category.find("id = ?",(long)4).first();
    	List<Word> words = category.words;
		render(words);
	}
	
	public static void word_regist(){
		render();
	}
	
	public static void word_regist_main(){
		
		Word w = new Word();
		UserData current_user = (UserData)renderArgs.get("current_user");
		w.name=params.get("name");
		w.key_type=params.get("key_type");
		w.userdata=current_user;
		Category c = new Category();
		c.id=(long)4;
		w.category=c;
		
		validation.valid(w);
		if( validation.hasErrors() ){
			params.flash();
			validation.keep();
			word_regist();
		}
		
		w.save();
		word_regist_complete();
	}
	
	public static void word_regist_complete(){
		render();
	}
	
	public static void word_delete(Long id){
		Word word = Word.findById(id);
		UserData current_user = (UserData)renderArgs.get("current_user");
		if(word == null || word.userdata == null || word.userdata.id != current_user.id){
			registed_words();
		}else{
			word.delete();
			word_delete_complete();
		}
	}
	
	public static void word_delete_complete(){
		render();
	}
	
	public static void word_edit(Long id){
		Word word = Word.findById(id);
		UserData current_user = (UserData)renderArgs.get("current_user");
		if(word == null || word.userdata == null || word.userdata.id != current_user.id)
			registed_words();
		render(word);
	}
	
	public static void word_edit_main(Long id, String name, String key_type){
		Word word = Word.findById(id);
		UserData current_user = (UserData)renderArgs.get("current_user");

		if(word == null || word.userdata == null || word.userdata.id != current_user.id){
			registed_words();
		}else{
			word.name=name;
			word.key_type=key_type;
			validation.valid(word);
			if( validation.hasErrors() ){
				params.flash();
				validation.keep();
				word_edit(word.id);
			}else{
				word.save();
				word_edit_complete();
			}
		}
		
	}
	
	public static void word_edit_complete(){
		render();
	}

}
