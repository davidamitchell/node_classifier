DataTable table = new DataTable();
table.Columns.Add("Sex");
table.Columns.Add("Height", typeof(double));
table.Columns.Add("Weight", typeof(double));
table.Columns.Add("FootSize", typeof(double));

//training data.
table.Rows.Add("male", 6, 180, 12);
table.Rows.Add("male", 5.92, 190, 11);
table.Rows.Add("male", 5.58, 170, 12);
table.Rows.Add("male", 5.92, 165, 10);
table.Rows.Add("female", 5, 100, 6);
table.Rows.Add("female", 5.5, 150, 8);
table.Rows.Add("female", 5.42, 130, 7);
table.Rows.Add("female", 5.75, 150, 9);
table.Rows.Add("transgender", 4, 200, 5);
table.Rows.Add("transgender", 4.10, 150, 8);
table.Rows.Add("transgender", 5.42, 190, 7);
table.Rows.Add("transgender", 5.50, 150, 9);

Classifier classifier = new Classifier();
classifier.TrainClassifier(table);
//output would be transgender.
Console.WriteLine(classifier.Classify(new double[] { 4, 150, 12 }));
Console.Read();

public void TrainClassifier(DataTable table)
{
    dataSet.Tables.Add(table);

    //table
    DataTable GaussianDistribution = dataSet.Tables.Add("Gaussian");
    GaussianDistribution.Columns.Add(table.Columns[0].ColumnName);

    //columns
    for (int i = 1; i < table.Columns.Count; i++)
    {
        GaussianDistribution.Columns.Add(table.Columns[i].ColumnName + "Mean");
        GaussianDistribution.Columns.Add(table.Columns[i].ColumnName + "Variance");
    }

    //calc data
    var results = (from myRow in table.AsEnumerable()
                   group myRow by myRow.Field<string>(table.Columns[0].ColumnName) into g
                   select new { Name = g.Key, Count = g.Count() }).ToList();

    for (int j = 0; j < results.Count; j++)
    {
        DataRow row = GaussianDistribution.Rows.Add();
        row[0] = results[j].Name;

        int a = 1;
        for (int i = 1; i < table.Columns.Count; i++)
        {
            row[a] = Helper.Mean(SelectRows(table, i, string.Format("{0} = '{1}'",
                                 table.Columns[0].ColumnName, results[j].Name)));
            row[++a] = Helper.Variance(SelectRows(table, i,
                       string.Format("{0} = '{1}'",
                       table.Columns[0].ColumnName, results[j].Name)));
            a++;
        }
    }
}


public string Classify(double[] obj)
{
    Dictionary<string,> score = new Dictionary<string,>();

    var results = (from myRow in dataSet.Tables[0].AsEnumerable()
                   group myRow by myRow.Field<string>(
                         dataSet.Tables[0].Columns[0].ColumnName) into g
                   select new { Name = g.Key, Count = g.Count() }).ToList();

    for (int i = 0; i < results.Count; i++)
    {
        List<double> subScoreList = new List<double>();
        int a = 1, b = 1;
        for (int k = 1; k < dataSet.Tables["Gaussian"].Columns.Count; k = k + 2)
        {
            double mean = Convert.ToDouble(dataSet.Tables["Gaussian"].Rows[i][a]);
            double variance = Convert.ToDouble(dataSet.Tables["Gaussian"].Rows[i][++a]);
            double result = Helper.NormalDist(obj[b - 1], mean, Helper.SquareRoot(variance));
            subScoreList.Add(result);
            a++; b++;
        }

        double finalScore = 0;
        for (int z = 0; z < subScoreList.Count; z++)
        {
            if (finalScore == 0)
            {
                finalScore = subScoreList[z];
                continue;
            }

            finalScore = finalScore * subScoreList[z];
        }

        score.Add(results[i].Name, finalScore * 0.5);
    }

    double maxOne = score.Max(c => c.Value);
    var name = (from c in score
                where c.Value == maxOne
                select c.Key).First();

    return name;
}
