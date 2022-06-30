const seguranca = require('../../model/components/seguranca')
const produtoBanco = require('../../model/repositories/produtoDB')

module.exports = function (app){

    //GET da Página Inicial
    app.get("/", function(req, resp){
        resp.send("<h1>Bem-vindo ao meu app</h1>");
    })

    //GET da Página de cadastro de novos usuários    
    app.get('/cadastro', function (req, res){
        if(req.query.fail) 
            res.render('produto/CadastroProduto', {mensagem: 'Cadastro'});
        else
            res.render('produto/CadastroProduto', {mensagem: null});

    })
    
    //POST da página EditProduto.ejs
    app.post('/cadastro/produto/edit/salvar', (req, res) => {
        var produto = { 
            nome: req.body.nome,
            senha: req.body.senha,
            id: req.body.id
        };
        try {
            produtoBanco.updateProduto(produto);
            res.render('produto/Sucesso', {mensagem: 'alterado'});
        } catch (error){
            res.render('produto/EditProduto', {title: 'Edição Cadastro', mensagem: "Erro no cadastro"})
        }
    })

    //POST da página Cadastroproduto.ejs 
    app.post('/cadastro/produto/salvar', seguranca.autenticar, (req, res) => {
        try {
            var produto = {nome: req.body.nome,
                           senha: seguranca.ocultarsenha(req.body.senha)}
            produtoBanco.insertProduto(produto);
            res.render('produto/Sucesso', {mensagem: 'cadastrado'});
        } catch (error){
            res.render('produto/CadastroProduto', { title: 'Cadastro', mensagem: "Erro no cadastro"})
        }
    })

    //GET da página lista.ejs
    app.get('/lista/produto', seguranca.autenticar, async (req, res, next) => {
        try{
            const docs = await produtoBanco.selectProduto();
            res.render('produto/Lista', { mensagem: 'Lista de Usuário', docs });
        } catch (err){
            next(err);
        }
    });

    //GET do botão delete da página lista.ejs
    app.get('/delete/produto/:id', seguranca.autenticar, async (req, res, next) => {
        try{
            var id = req.params.id;
            await produtoBanco.deleteProduto(id);
            const docs = await produtoBanco.selectProduto();
            res.render('produto/Lista', { mensagem: 'Produto excluído com sucesso', docs });
        } catch (err){
            next(err);
        }
    });

    //GET do botão editar da página lista.ejs
    app.get('/edit/produto/:id', seguranca.autenticar, async (req, res, next) => {
        try{
            var id = req.params.id;
            const produto = await produtoBanco.getProdutoId(id);
            res.render('produto/EditProduto', { mensagem: '', produto });
        } catch (err){
            next(err);
        }
    });

    //GET da página Login.ejs
    app.get('/login', function (req, res) {
        if(req.query.fail) res.render('produto/Login', { mensagemLogin: 'Usúario e/ou senha incorretos!'});
        else res.render('produto/Login', { mensagemLogin: null});
    });

}